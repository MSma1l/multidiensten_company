<?php
/**
 * Job custom post type: registration, admin meta box, save handler and the
 * admin list columns. Everything is managed through the meta box (the post
 * has no default title/editor); the WP post_title is synced from the NL title
 * on save so the admin list stays readable.
 *
 * @package Multidiensten
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the `job` post type. Not public on the front end (jobs are rendered
 * by the Vacatures page template); fully manageable in wp-admin.
 */
function md_register_job_cpt() {
	$labels = array(
		'name'               => 'Vacatures',
		'singular_name'      => 'Vacature',
		'menu_name'          => 'Vacatures',
		'add_new'            => 'Nieuwe toevoegen',
		'add_new_item'       => 'Nieuwe vacature',
		'edit_item'          => 'Vacature bewerken',
		'new_item'           => 'Nieuwe vacature',
		'view_item'          => 'Vacature bekijken',
		'search_items'       => 'Vacatures zoeken',
		'not_found'          => 'Geen vacatures gevonden',
		'not_found_in_trash' => 'Geen vacatures in de prullenbak',
		'all_items'          => 'Alle vacatures',
	);

	register_post_type(
		'job',
		array(
			'labels'        => $labels,
			'public'        => false,
			'show_ui'       => true,
			'show_in_menu'  => true,
			'menu_position' => 5,
			'menu_icon'     => 'dashicons-businessman',
			'supports'      => false,
			'has_archive'   => false,
			'rewrite'       => false,
		)
	);
}
add_action( 'init', 'md_register_job_cpt' );

/**
 * Register the "Vacature details" meta box on the job edit screen.
 */
function md_add_job_meta_box() {
	add_meta_box(
		'md_job_details',
		'Vacature details',
		'md_render_job_meta_box',
		'job',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'md_add_job_meta_box' );

/**
 * Render the meta box fields.
 *
 * @param WP_Post $post Current job post.
 */
function md_render_job_meta_box( $post ) {
	wp_nonce_field( 'md_save_job', 'md_job_nonce' );

	$options = md_filter_options();

	$title_nl   = get_post_meta( $post->ID, '_md_title_nl', true );
	$title_en   = get_post_meta( $post->ID, '_md_title_en', true );
	$desc_nl    = get_post_meta( $post->ID, '_md_desc_nl', true );
	$desc_en    = get_post_meta( $post->ID, '_md_desc_en', true );
	$company    = get_post_meta( $post->ID, '_md_company', true );
	$location   = get_post_meta( $post->ID, '_md_location', true );
	$level      = get_post_meta( $post->ID, '_md_level', true );
	$experience = get_post_meta( $post->ID, '_md_experience_years', true );
	$hours      = get_post_meta( $post->ID, '_md_hours_per_week', true );
	$salary_min = get_post_meta( $post->ID, '_md_salary_min', true );
	$salary_max = get_post_meta( $post->ID, '_md_salary_max', true );

	if ( '' === $company ) {
		$company = defined( 'MD_BRAND' ) ? MD_BRAND : '';
	}

	$level_labels = array(
		'junior' => 'Junior',
		'middle' => 'Medior',
		'senior' => 'Senior',
	);

	$row_style   = 'margin-bottom:16px;';
	$label_style = 'display:block;font-weight:600;margin-bottom:4px;';
	$field_style = 'width:100%;max-width:520px;padding:6px 8px;';
	$hint_style  = 'display:block;color:#666;font-size:12px;margin-top:4px;';
	?>
	<div class="md-job-fields">
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_title_nl">Titel (NL)</label>
			<input type="text" id="md_title_nl" name="md_title_nl" style="<?php echo esc_attr( $field_style ); ?>" value="<?php echo esc_attr( $title_nl ); ?>" />
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_title_en">Title (EN)</label>
			<input type="text" id="md_title_en" name="md_title_en" style="<?php echo esc_attr( $field_style ); ?>" value="<?php echo esc_attr( $title_en ); ?>" />
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_desc_nl">Omschrijving (NL)</label>
			<textarea id="md_desc_nl" name="md_desc_nl" rows="3" style="<?php echo esc_attr( $field_style ); ?>"><?php echo esc_textarea( $desc_nl ); ?></textarea>
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_desc_en">Description (EN)</label>
			<textarea id="md_desc_en" name="md_desc_en" rows="3" style="<?php echo esc_attr( $field_style ); ?>"><?php echo esc_textarea( $desc_en ); ?></textarea>
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_company">Bedrijf / Company</label>
			<input type="text" id="md_company" name="md_company" style="<?php echo esc_attr( $field_style ); ?>" value="<?php echo esc_attr( $company ); ?>" />
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_location">Locatie / Location</label>
			<select id="md_location" name="md_location" style="<?php echo esc_attr( $field_style ); ?>">
				<option value="">—</option>
				<?php foreach ( $options['cities'] as $city ) : ?>
					<option value="<?php echo esc_attr( $city ); ?>" <?php selected( $location, $city ); ?>><?php echo esc_html( $city ); ?></option>
				<?php endforeach; ?>
			</select>
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_level">Niveau / Level</label>
			<select id="md_level" name="md_level" style="<?php echo esc_attr( $field_style ); ?>">
				<option value="">—</option>
				<?php foreach ( $options['levels'] as $lvl ) : ?>
					<option value="<?php echo esc_attr( $lvl ); ?>" <?php selected( $level, $lvl ); ?>><?php echo esc_html( $level_labels[ $lvl ] ); ?></option>
				<?php endforeach; ?>
			</select>
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_experience_years">Ervaring (jaren) / Experience years</label>
			<input type="number" min="0" step="1" id="md_experience_years" name="md_experience_years" style="<?php echo esc_attr( $field_style ); ?>" value="<?php echo esc_attr( $experience ); ?>" />
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_hours_per_week">Uren per week / Hours per week</label>
			<select id="md_hours_per_week" name="md_hours_per_week" style="<?php echo esc_attr( $field_style ); ?>">
				<option value="">—</option>
				<?php foreach ( $options['hours'] as $h ) : ?>
					<option value="<?php echo esc_attr( $h ); ?>" <?php selected( (int) $hours, (int) $h ); ?>><?php echo esc_html( $h ); ?></option>
				<?php endforeach; ?>
			</select>
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_salary_min">Salaris min (€)</label>
			<input type="number" min="0" step="1" id="md_salary_min" name="md_salary_min" style="<?php echo esc_attr( $field_style ); ?>" value="<?php echo esc_attr( $salary_min ); ?>" />
		</p>
		<p style="<?php echo esc_attr( $row_style ); ?>">
			<label style="<?php echo esc_attr( $label_style ); ?>" for="md_salary_max">Salaris max (€)</label>
			<input type="number" min="0" step="1" id="md_salary_max" name="md_salary_max" style="<?php echo esc_attr( $field_style ); ?>" value="<?php echo esc_attr( $salary_max ); ?>" />
			<span style="<?php echo esc_attr( $hint_style ); ?>">
				<span class="hidden-nl">Laat max leeg voor één vast bedrag</span>
				<span class="hidden-en">Leave max empty for a single fixed amount</span>
			</span>
		</p>
	</div>
	<?php
}

/**
 * Persist the meta box fields on save. Verifies the nonce + capability, then
 * sanitises every field with the matching sanitiser before saving. Finally
 * syncs the post_title from the NL (or EN) title, guarding against the
 * save_post recursion that wp_update_post would otherwise trigger.
 *
 * @param int $post_id Post being saved.
 */
function md_save_job_meta( $post_id ) {
	// Nonce.
	if ( ! isset( $_POST['md_job_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['md_job_nonce'] ) ), 'md_save_job' ) ) {
		return;
	}

	// Skip autosaves / revisions.
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}

	// Capability.
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	// Text / select fields.
	$text_fields = array(
		'_md_title_nl' => 'md_title_nl',
		'_md_title_en' => 'md_title_en',
		'_md_company'  => 'md_company',
		'_md_location' => 'md_location',
		'_md_level'    => 'md_level',
	);
	foreach ( $text_fields as $meta_key => $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $meta_key, sanitize_text_field( wp_unslash( $_POST[ $field ] ) ) );
		}
	}

	// Description textareas.
	$textarea_fields = array(
		'_md_desc_nl' => 'md_desc_nl',
		'_md_desc_en' => 'md_desc_en',
	);
	foreach ( $textarea_fields as $meta_key => $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $meta_key, sanitize_textarea_field( wp_unslash( $_POST[ $field ] ) ) );
		}
	}

	// Numeric fields.
	$number_fields = array(
		'_md_experience_years' => 'md_experience_years',
		'_md_hours_per_week'   => 'md_hours_per_week',
		'_md_salary_min'       => 'md_salary_min',
		'_md_salary_max'       => 'md_salary_max',
	);
	foreach ( $number_fields as $meta_key => $field ) {
		if ( isset( $_POST[ $field ] ) ) {
			update_post_meta( $post_id, $meta_key, absint( wp_unslash( $_POST[ $field ] ) ) );
		}
	}

	// Sync the readable post title from NL (fall back to EN).
	$title_nl = isset( $_POST['md_title_nl'] ) ? sanitize_text_field( wp_unslash( $_POST['md_title_nl'] ) ) : '';
	$title_en = isset( $_POST['md_title_en'] ) ? sanitize_text_field( wp_unslash( $_POST['md_title_en'] ) ) : '';
	$new_title = '' !== $title_nl ? $title_nl : $title_en;

	if ( '' !== $new_title && get_post_field( 'post_title', $post_id ) !== $new_title ) {
		// Detach to avoid recursion, update, then reattach.
		remove_action( 'save_post_job', 'md_save_job_meta' );
		wp_update_post(
			array(
				'ID'         => $post_id,
				'post_title' => $new_title,
			)
		);
		add_action( 'save_post_job', 'md_save_job_meta' );
	}
}
add_action( 'save_post_job', 'md_save_job_meta' );

/**
 * Define the admin list columns for jobs.
 *
 * @param array $columns Existing columns.
 * @return array
 */
function md_job_columns( $columns ) {
	return array(
		'cb'           => isset( $columns['cb'] ) ? $columns['cb'] : '<input type="checkbox" />',
		'title'        => 'Titel',
		'md_location'  => 'Locatie',
		'md_salary'    => 'Salaris',
		'md_level'     => 'Niveau',
		'date'         => 'Datum',
	);
}
add_filter( 'manage_job_posts_columns', 'md_job_columns' );

/**
 * Render the custom admin column values.
 *
 * @param string $column  Column key.
 * @param int    $post_id Post ID.
 */
function md_job_custom_column( $column, $post_id ) {
	switch ( $column ) {
		case 'md_location':
			echo esc_html( get_post_meta( $post_id, '_md_location', true ) );
			break;
		case 'md_salary':
			$min = (int) get_post_meta( $post_id, '_md_salary_min', true );
			$max = (int) get_post_meta( $post_id, '_md_salary_max', true );
			echo esc_html( md_salary_label( $min, $max ) );
			break;
		case 'md_level':
			$level  = get_post_meta( $post_id, '_md_level', true );
			$labels = array(
				'junior' => 'Junior',
				'middle' => 'Medior',
				'senior' => 'Senior',
			);
			echo esc_html( isset( $labels[ $level ] ) ? $labels[ $level ] : $level );
			break;
	}
}
add_action( 'manage_job_posts_custom_column', 'md_job_custom_column', 10, 2 );
