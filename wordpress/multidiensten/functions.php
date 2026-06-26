<?php
/**
 * Multidiensten theme bootstrap.
 *
 * Self-contained recruitment theme: registers the Job + Submission post types,
 * enqueues the front-end assets, and wires the AJAX contact-form handler.
 * No external plugins are required.
 *
 * @package Multidiensten
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

define( 'MD_THEME_VERSION', '1.0.0' );
define( 'MD_THEME_DIR', get_template_directory() );
define( 'MD_THEME_URI', get_template_directory_uri() );

// Public brand name shown across the site (logo, footer, default job company).
define( 'MD_BRAND', 'Randstad-Diensten' );

require_once MD_THEME_DIR . '/inc/helpers.php';
require_once MD_THEME_DIR . '/inc/setup.php';
require_once MD_THEME_DIR . '/inc/cpt-job.php';
require_once MD_THEME_DIR . '/inc/submissions.php';
require_once MD_THEME_DIR . '/inc/contact-form.php';

/**
 * Basic theme supports.
 */
function md_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'script', 'style' ) );
	add_theme_support( 'automatic-feed-links' );
}
add_action( 'after_setup_theme', 'md_theme_setup' );

/**
 * Front-end styles & scripts.
 */
function md_enqueue_assets() {
	// Font Awesome (icons used throughout the design).
	wp_enqueue_style(
		'font-awesome',
		'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
		array(),
		'6.4.0'
	);

	// Main theme stylesheet (the WordPress style.css with the theme header).
	wp_enqueue_style(
		'multidiensten',
		get_stylesheet_uri(),
		array( 'font-awesome' ),
		MD_THEME_VERSION
	);

	// Language switcher + page niceties.
	wp_enqueue_script(
		'md-main',
		MD_THEME_URI . '/js/main.js',
		array(),
		MD_THEME_VERSION,
		true
	);

	// Jobs filtering (only meaningful on the jobs page, but cheap to always load).
	wp_enqueue_script(
		'md-jobs',
		MD_THEME_URI . '/js/jobs.js',
		array(),
		MD_THEME_VERSION,
		true
	);

	// Carousel for the Features + Testimonials sections (swipe on mobile).
	wp_enqueue_script(
		'md-carousel',
		MD_THEME_URI . '/js/carousel.js',
		array(),
		MD_THEME_VERSION,
		true
	);

	// Contact form AJAX submit.
	wp_enqueue_script(
		'md-contact',
		MD_THEME_URI . '/js/contact.js',
		array(),
		MD_THEME_VERSION,
		true
	);

	// Pass server data + bilingual JS strings to the contact script.
	wp_localize_script(
		'md-contact',
		'MD_CONTACT',
		array(
			'ajaxUrl' => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'md_contact_nonce' ),
			'i18n'    => array(
				'nl' => array(
					'submitting'  => 'Versturen...',
					'submit'      => 'Verzoek Versturen',
					'success'     => 'Perfect! Wij nemen binnenkort contact met u op met geweldige kansen.',
					'serverError' => 'Er ging iets mis bij het versturen. Probeer het later opnieuw.',
					'cvType'      => 'Alleen PDF-, DOC- of DOCX-bestanden zijn toegestaan.',
					'cvSize'      => 'Het bestand mag niet groter zijn dan 5 MB.',
				),
				'en' => array(
					'submitting'  => 'Sending...',
					'submit'      => 'Send Request',
					'success'     => 'Perfect! We will contact you very soon with exciting opportunities.',
					'serverError' => 'Something went wrong while sending your request. Please try again later.',
					'cvType'      => 'Only PDF, DOC or DOCX files are allowed.',
					'cvSize'      => 'The file must not be larger than 5 MB.',
				),
			),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'md_enqueue_assets' );

/**
 * Give the <body> the default NL language class so CSS show/hide works before
 * JS runs. main.js re-applies the saved language from localStorage on load.
 *
 * @param string[] $classes Body classes.
 * @return string[]
 */
function md_body_class( $classes ) {
	$classes[] = 'lang-nl';
	return $classes;
}
add_filter( 'body_class', 'md_body_class' );
