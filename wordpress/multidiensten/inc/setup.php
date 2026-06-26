<?php
/**
 * One-time theme setup: auto-create the Vacatures + Contact pages and a static
 * Home front page on activation, so navigation works out of the box with zero
 * manual configuration. Runs again safely (idempotent) — existing pages are
 * reused, never duplicated.
 *
 * @package Multidiensten
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Create (or reuse) a page by slug and assign a page template.
 *
 * @param string $slug     Desired page slug.
 * @param string $title    Page title.
 * @param string $template Template file relative to theme root, or '' for none.
 * @return int Page ID.
 */
function md_ensure_page( $slug, $title, $template = '' ) {
	$existing = get_page_by_path( $slug );
	if ( $existing ) {
		$page_id = $existing->ID;
	} else {
		$page_id = wp_insert_post(
			array(
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'post_content' => '',
			)
		);
	}

	if ( $page_id && ! is_wp_error( $page_id ) && $template ) {
		update_post_meta( $page_id, '_wp_page_template', $template );
	}

	return is_wp_error( $page_id ) ? 0 : (int) $page_id;
}

/**
 * Provision pages + front page when the theme is activated.
 */
function md_after_switch_theme() {
	$home_id = md_ensure_page( 'home', 'Home' );
	md_ensure_page( 'vacatures', 'Vacatures', 'page-jobs.php' );
	md_ensure_page( 'contact', 'Contact', 'page-contact.php' );

	if ( $home_id ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home_id );
	}

	// Make sure the new CPT + page rewrite rules are live.
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'md_after_switch_theme' );
