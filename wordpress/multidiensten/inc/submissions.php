<?php
/**
 * Sollicitaties (contact-form submissions) admin.
 *
 * Registers the read-only `submission` post type used to view entries created
 * by the public contact form (see inc/contact-form.php). Entries cannot be
 * created manually — only the form handler inserts them. The edit screen shows
 * every field read-only and offers a CV download when one was uploaded.
 *
 * @package Multidiensten
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the `submission` post type. Visible in wp-admin only; the "Add New"
 * button is removed via the create_posts capability so entries are created
 * exclusively by the contact-form handler.
 */
function md_register_submission_cpt() {
	$labels = array(
		'name'               => 'Sollicitaties',
		'singular_name'      => 'Sollicitatie',
		'menu_name'          => 'Sollicitaties',
		'all_items'          => 'Alle sollicitaties',
		'edit_item'          => 'Sollicitatie bekijken',
		'view_item'          => 'Sollicitatie bekijken',
		'search_items'       => 'Sollicitaties zoeken',
		'not_found'          => 'Geen sollicitaties gevonden',
		'not_found_in_trash' => 'Geen sollicitaties in de prullenbak',
	);

	register_post_type(
		'submission',
		array(
			'labels'        => $labels,
			'public'        => false,
			'show_ui'       => true,
			'show_in_menu'  => true,
			'menu_position' => 6,
			'menu_icon'     => 'dashicons-email-alt',
			'supports'      => false,
			'has_archive'   => false,
			'rewrite'       => false,
			'capability_type' => 'post',
			'map_meta_cap'  => true,
			'capabilities'  => array(
				'create_posts' => 'do_not_allow',
			),
		)
	);
}
add_action( 'init', 'md_register_submission_cpt' );

/**
 * Define the admin list columns for submissions.
 *
 * @param array $columns Existing columns.
 * @return array
 */
function md_submission_columns( $columns ) {
	return array(
		'cb'             => isset( $columns['cb'] ) ? $columns['cb'] : '<input type="checkbox" />',
		'md_name'        => 'Naam',
		'md_email'       => 'E-mail',
		'md_phone'       => 'Telefoon',
		'md_cv'          => 'CV',
		'date'           => 'Datum',
	);
}
add_filter( 'manage_submission_posts_columns', 'md_submission_columns' );

/**
 * Render the custom admin column values.
 *
 * @param string $column  Column key.
 * @param int    $post_id Post ID.
 */
function md_submission_custom_column( $column, $post_id ) {
	switch ( $column ) {
		case 'md_name':
			$first = get_post_meta( $post_id, '_md_first_name', true );
			$last  = get_post_meta( $post_id, '_md_last_name', true );
			echo esc_html( trim( $first . ' ' . $last ) );
			break;

		case 'md_email':
			$email = get_post_meta( $post_id, '_md_email', true );
			if ( $email ) {
				printf(
					'<a href="%1$s">%2$s</a>',
					esc_url( 'mailto:' . $email ),
					esc_html( $email )
				);
			} else {
				echo '&mdash;';
			}
			break;

		case 'md_phone':
			$phone = get_post_meta( $post_id, '_md_phone', true );
			echo $phone ? esc_html( $phone ) : '&mdash;';
			break;

		case 'md_cv':
			$cv_id = (int) get_post_meta( $post_id, '_md_cv_id', true );
			$url   = $cv_id ? wp_get_attachment_url( $cv_id ) : '';
			if ( $url ) {
				printf(
					'<a href="%1$s" target="_blank" rel="noopener noreferrer">%2$s</a>',
					esc_url( $url ),
					esc_html__( 'Download CV', 'multidiensten' )
				);
			} else {
				echo '&mdash;';
			}
			break;
	}
}
add_action( 'manage_submission_posts_custom_column', 'md_submission_custom_column', 10, 2 );

/**
 * Register the read-only "Sollicitatie details" meta box.
 */
function md_add_submission_meta_box() {
	add_meta_box(
		'md_submission_details',
		'Sollicitatie details',
		'md_render_submission_meta_box',
		'submission',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'md_add_submission_meta_box' );

/**
 * Render the submission details as a read-only definition list.
 *
 * @param WP_Post $post Current submission post.
 */
function md_render_submission_meta_box( $post ) {
	$first   = get_post_meta( $post->ID, '_md_first_name', true );
	$last    = get_post_meta( $post->ID, '_md_last_name', true );
	$email   = get_post_meta( $post->ID, '_md_email', true );
	$phone   = get_post_meta( $post->ID, '_md_phone', true );
	$message = get_post_meta( $post->ID, '_md_message', true );
	$lang    = get_post_meta( $post->ID, '_md_lang', true );
	$ip      = get_post_meta( $post->ID, '_md_ip', true );
	$cv_id   = (int) get_post_meta( $post->ID, '_md_cv_id', true );
	$cv_url  = $cv_id ? wp_get_attachment_url( $cv_id ) : '';

	$name = trim( $first . ' ' . $last );
	$date = get_post_time( get_option( 'date_format' ) . ' ' . get_option( 'time_format' ), false, $post );

	$dt_style = 'font-weight:600;color:#1d2327;margin-top:12px;';
	$dd_style = 'margin:4px 0 0;color:#3c434a;';
	?>
	<dl class="md-submission-details" style="margin:0;">
		<dt style="<?php echo esc_attr( $dt_style ); ?>">Naam</dt>
		<dd style="<?php echo esc_attr( $dd_style ); ?>"><?php echo esc_html( '' !== $name ? $name : '—' ); ?></dd>

		<dt style="<?php echo esc_attr( $dt_style ); ?>">E-mail</dt>
		<dd style="<?php echo esc_attr( $dd_style ); ?>">
			<?php if ( $email ) : ?>
				<a href="<?php echo esc_url( 'mailto:' . $email ); ?>"><?php echo esc_html( $email ); ?></a>
			<?php else : ?>
				&mdash;
			<?php endif; ?>
		</dd>

		<dt style="<?php echo esc_attr( $dt_style ); ?>">Telefoon</dt>
		<dd style="<?php echo esc_attr( $dd_style ); ?>"><?php echo $phone ? esc_html( $phone ) : '&mdash;'; ?></dd>

		<dt style="<?php echo esc_attr( $dt_style ); ?>">Bericht</dt>
		<dd style="<?php echo esc_attr( $dd_style ); ?>; white-space:pre-wrap;"><?php echo $message ? esc_html( $message ) : '&mdash;'; ?></dd>

		<dt style="<?php echo esc_attr( $dt_style ); ?>">Taal</dt>
		<dd style="<?php echo esc_attr( $dd_style ); ?>"><?php echo $lang ? esc_html( strtoupper( $lang ) ) : '&mdash;'; ?></dd>

		<dt style="<?php echo esc_attr( $dt_style ); ?>">IP</dt>
		<dd style="<?php echo esc_attr( $dd_style ); ?>"><?php echo $ip ? esc_html( $ip ) : '&mdash;'; ?></dd>

		<dt style="<?php echo esc_attr( $dt_style ); ?>">Ontvangen op</dt>
		<dd style="<?php echo esc_attr( $dd_style ); ?>"><?php echo esc_html( $date ); ?></dd>
	</dl>

	<?php if ( $cv_url ) : ?>
		<p style="margin-top:20px;">
			<a class="button button-primary button-large" href="<?php echo esc_url( $cv_url ); ?>" target="_blank" rel="noopener noreferrer">
				<span class="dashicons dashicons-download" style="margin-top:4px;"></span>
				Download CV
			</a>
		</p>
	<?php endif; ?>
	<?php
}
