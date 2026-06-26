<?php
/**
 * Contact form AJAX handler.
 *
 * Receives the public contact-form submission (action `md_contact_submit`),
 * validates every field server-side (mirroring src/utils/validation.js and the
 * FastAPI backend), optionally stores an uploaded CV in the Media Library, and
 * persists the entry as a `submission` post (see inc/submissions.php).
 *
 * Always responds with JSON via wp_send_json_success / wp_send_json_error.
 *
 * @package Multidiensten
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Bilingual messages used by the AJAX handler. Mirrors the strings in
 * src/data/translations.js (contact + contact.errors).
 *
 * @return array
 */
function md_contact_messages() {
	return array(
		'nl' => array(
			'success'           => 'Perfect! Wij nemen binnenkort contact met u op met geweldige kansen.',
			'serverError'       => 'Er ging iets mis bij het versturen. Probeer het later opnieuw.',
			'firstNameRequired' => 'Voer uw voornaam in.',
			'firstNameInvalid'  => 'De voornaam mag alleen letters bevatten (min. 2 tekens).',
			'lastNameRequired'  => 'Voer uw achternaam in.',
			'lastNameInvalid'   => 'De achternaam mag alleen letters bevatten (min. 2 tekens).',
			'emailRequired'     => 'Voer uw e-mailadres in.',
			'emailInvalid'      => 'Voer een geldig e-mailadres in.',
			'phoneRequired'     => 'Voer uw telefoonnummer in.',
			'phoneInvalid'      => 'Voer een geldig telefoonnummer in.',
			'messageRequired'   => 'Schrijf een bericht.',
			'messageInvalid'    => 'Het bericht moet minstens 10 tekens bevatten.',
			'cvType'            => 'Alleen PDF-, DOC- of DOCX-bestanden zijn toegestaan.',
			'cvSize'            => 'Het bestand mag niet groter zijn dan 5 MB.',
		),
		'en' => array(
			'success'           => 'Perfect! We will contact you very soon with exciting opportunities.',
			'serverError'       => 'Something went wrong while sending your request. Please try again later.',
			'firstNameRequired' => 'Please enter your first name.',
			'firstNameInvalid'  => 'First name must contain only letters (min. 2 characters).',
			'lastNameRequired'  => 'Please enter your last name.',
			'lastNameInvalid'   => 'Last name must contain only letters (min. 2 characters).',
			'emailRequired'     => 'Please enter your email address.',
			'emailInvalid'      => 'Please enter a valid email address.',
			'phoneRequired'     => 'Please enter your phone number.',
			'phoneInvalid'      => 'Please enter a valid phone number.',
			'messageRequired'   => 'Please write a message.',
			'messageInvalid'    => 'Your message must be at least 10 characters.',
			'cvType'            => 'Only PDF, DOC or DOCX files are allowed.',
			'cvSize'            => 'The file must not be larger than 5 MB.',
		),
	);
}

/**
 * Validate a name value (first or last). Mirrors NAME_REGEX in validation.js:
 * starts with a letter, then 1+ of letters / spaces / hyphens / apostrophes,
 * accented characters allowed, no digits. Minimum effective length 2.
 *
 * @param string $value Trimmed name.
 * @return bool
 */
function md_contact_valid_name( $value ) {
	// \p{L} = any Unicode letter (the /u flag enables Unicode).
	return (bool) preg_match( "/^\p{L}[\p{L}\s'-]{1,}$/u", $value );
}

/**
 * Validate a phone value. Mirrors validatePhone() in validation.js: only
 * digits, spaces, +, -, parentheses; require 7–15 actual digits.
 *
 * @param string $value Trimmed phone.
 * @return bool
 */
function md_contact_valid_phone( $value ) {
	if ( ! preg_match( '/^[+]?[\d\s()-]+$/', $value ) ) {
		return false;
	}
	$digits = preg_replace( '/\D/', '', $value );
	$len    = strlen( $digits );
	return $len >= 7 && $len <= 15;
}

/**
 * Handle the contact-form AJAX submission. Registered for both logged-in and
 * logged-out visitors (public form). Always terminates via wp_send_json_*.
 */
function md_handle_contact_submit() {
	// 1. Verify the nonce (JS sends it as the `nonce` field).
	check_ajax_referer( 'md_contact_nonce', 'nonce' );

	// Resolve the language + message dictionary up front.
	$messages = md_contact_messages();
	$lang     = isset( $_POST['lang'] ) ? sanitize_text_field( wp_unslash( $_POST['lang'] ) ) : 'nl';
	if ( ! isset( $messages[ $lang ] ) ) {
		$lang = 'nl';
	}
	$m = $messages[ $lang ];

	// 2. Read + sanitize the text fields.
	$first_name = isset( $_POST['first_name'] ) ? sanitize_text_field( wp_unslash( $_POST['first_name'] ) ) : '';
	$last_name  = isset( $_POST['last_name'] ) ? sanitize_text_field( wp_unslash( $_POST['last_name'] ) ) : '';
	$email      = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$phone      = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$message    = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';

	$first_name = trim( $first_name );
	$last_name  = trim( $last_name );
	$email      = trim( $email );
	$phone      = trim( $phone );
	$message    = trim( $message );

	// 3. Server-side validation, mirroring validation.js.
	if ( '' === $first_name ) {
		wp_send_json_error( array( 'message' => $m['firstNameRequired'], 'field' => 'first_name' ) );
	}
	if ( ! md_contact_valid_name( $first_name ) ) {
		wp_send_json_error( array( 'message' => $m['firstNameInvalid'], 'field' => 'first_name' ) );
	}
	if ( '' === $last_name ) {
		wp_send_json_error( array( 'message' => $m['lastNameRequired'], 'field' => 'last_name' ) );
	}
	if ( ! md_contact_valid_name( $last_name ) ) {
		wp_send_json_error( array( 'message' => $m['lastNameInvalid'], 'field' => 'last_name' ) );
	}
	if ( '' === $email ) {
		wp_send_json_error( array( 'message' => $m['emailRequired'], 'field' => 'email' ) );
	}
	if ( ! is_email( $email ) ) {
		wp_send_json_error( array( 'message' => $m['emailInvalid'], 'field' => 'email' ) );
	}
	if ( '' === $phone ) {
		wp_send_json_error( array( 'message' => $m['phoneRequired'], 'field' => 'phone' ) );
	}
	if ( ! md_contact_valid_phone( $phone ) ) {
		wp_send_json_error( array( 'message' => $m['phoneInvalid'], 'field' => 'phone' ) );
	}
	if ( '' === $message ) {
		wp_send_json_error( array( 'message' => $m['messageRequired'], 'field' => 'message' ) );
	}
	if ( strlen( $message ) < 10 ) {
		wp_send_json_error( array( 'message' => $m['messageInvalid'], 'field' => 'message' ) );
	}

	// 4. Optional CV upload — validate extension + size BEFORE moving the file.
	$cv_id = 0;
	if ( isset( $_FILES['cv'] ) && ! empty( $_FILES['cv']['name'] ) ) {
		$file = $_FILES['cv']; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput

		// Surface PHP upload errors as a generic server error.
		if ( isset( $file['error'] ) && UPLOAD_ERR_OK !== (int) $file['error'] ) {
			wp_send_json_error( array( 'message' => $m['serverError'] ) );
		}

		$allowed   = array( 'pdf', 'doc', 'docx' );
		$file_name = sanitize_file_name( $file['name'] );
		$ext       = strtolower( pathinfo( $file_name, PATHINFO_EXTENSION ) );
		if ( ! in_array( $ext, $allowed, true ) ) {
			wp_send_json_error( array( 'message' => $m['cvType'], 'field' => 'cv' ) );
		}

		$max_bytes = 5 * 1024 * 1024; // 5 MB.
		if ( isset( $file['size'] ) && (int) $file['size'] > $max_bytes ) {
			wp_send_json_error( array( 'message' => $m['cvSize'], 'field' => 'cv' ) );
		}

		// Load the WordPress upload + media helpers.
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		$mimes = array(
			'pdf'  => 'application/pdf',
			'doc'  => 'application/msword',
			'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		);

		$upload = wp_handle_upload(
			$file,
			array(
				'test_form' => false,
				'mimes'     => $mimes,
			)
		);

		if ( ! is_array( $upload ) || isset( $upload['error'] ) ) {
			wp_send_json_error( array( 'message' => $m['serverError'] ) );
		}

		$attachment = array(
			'post_mime_type' => isset( $upload['type'] ) ? $upload['type'] : '',
			'post_title'     => $file_name,
			'post_content'   => '',
			'post_status'    => 'inherit',
		);

		$cv_id = wp_insert_attachment( $attachment, $upload['file'] );
		if ( is_wp_error( $cv_id ) || ! $cv_id ) {
			wp_send_json_error( array( 'message' => $m['serverError'] ) );
		}

		$meta = wp_generate_attachment_metadata( $cv_id, $upload['file'] );
		wp_update_attachment_metadata( $cv_id, $meta );
	}

	// 5. Capture the client IP from the server (never trust the client).
	$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';

	// 6. Persist the submission post + meta.
	$post_id = wp_insert_post(
		array(
			'post_type'   => 'submission',
			'post_status' => 'publish',
			'post_title'  => trim( $first_name . ' ' . $last_name ),
		),
		true
	);

	if ( is_wp_error( $post_id ) || ! $post_id ) {
		wp_send_json_error( array( 'message' => $m['serverError'] ) );
	}

	update_post_meta( $post_id, '_md_first_name', $first_name );
	update_post_meta( $post_id, '_md_last_name', $last_name );
	update_post_meta( $post_id, '_md_email', $email );
	update_post_meta( $post_id, '_md_phone', $phone );
	update_post_meta( $post_id, '_md_message', $message );
	update_post_meta( $post_id, '_md_lang', $lang );
	update_post_meta( $post_id, '_md_ip', $ip );
	if ( $cv_id ) {
		update_post_meta( $post_id, '_md_cv_id', (int) $cv_id );
	}

	// 7. Success.
	wp_send_json_success( array( 'message' => $m['success'] ) );
}
add_action( 'wp_ajax_md_contact_submit', 'md_handle_contact_submit' );
add_action( 'wp_ajax_nopriv_md_contact_submit', 'md_handle_contact_submit' );
