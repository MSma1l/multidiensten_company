<?php
/**
 * Shared helpers: job field access, salary formatting & bucketing.
 *
 * @package Multidiensten
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Format a euro amount the Dutch way: 2500 -> "2.500".
 *
 * @param int $amount Amount in whole euros.
 * @return string
 */
function md_format_euro( $amount ) {
	return number_format( (int) $amount, 0, ',', '.' );
}

/**
 * Build the salary display label from the stored min/max values.
 * A single amount (max empty or equal) renders as one figure.
 *
 * @param int $min Minimum salary.
 * @param int $max Maximum salary.
 * @return string e.g. "€2.500 - €3.200" or "€2.500".
 */
function md_salary_label( $min, $max ) {
	$min = (int) $min;
	$max = (int) $max;
	if ( $min <= 0 && $max <= 0 ) {
		return '';
	}
	if ( $max <= 0 || $max === $min ) {
		return '€' . md_format_euro( $min );
	}
	return '€' . md_format_euro( $min ) . ' - €' . md_format_euro( $max );
}

/**
 * Map a minimum salary to the coarse filter bucket used on the jobs page.
 * Mirrors the original four brackets: 0-2000, 2000-3000, 3000-4000, 4000+.
 *
 * @param int $min Minimum salary.
 * @return string Bucket value.
 */
function md_salary_bucket( $min ) {
	$min = (int) $min;
	if ( $min < 2000 ) {
		return '0-2000';
	}
	if ( $min < 3000 ) {
		return '2000-3000';
	}
	if ( $min < 4000 ) {
		return '3000-4000';
	}
	return '4000+';
}

/**
 * Read all job fields for a given post into a normalised array, ready for both
 * server-side rendering and the JS data island used by the filter script.
 *
 * @param int $post_id Job post ID.
 * @return array
 */
function md_get_job_data( $post_id ) {
	$min = (int) get_post_meta( $post_id, '_md_salary_min', true );
	$max = (int) get_post_meta( $post_id, '_md_salary_max', true );

	return array(
		'id'              => $post_id,
		'title'           => get_post_meta( $post_id, '_md_title_nl', true ),
		'titleEN'         => get_post_meta( $post_id, '_md_title_en', true ),
		'desc'            => get_post_meta( $post_id, '_md_desc_nl', true ),
		'descEN'          => get_post_meta( $post_id, '_md_desc_en', true ),
		'company'         => get_post_meta( $post_id, '_md_company', true ),
		'location'        => get_post_meta( $post_id, '_md_location', true ),
		'level'           => get_post_meta( $post_id, '_md_level', true ),
		'experienceYears' => (int) get_post_meta( $post_id, '_md_experience_years', true ),
		'hoursPerWeek'    => (int) get_post_meta( $post_id, '_md_hours_per_week', true ),
		'salaryMin'       => $min,
		'salaryMax'       => $max,
		'salary'          => md_salary_label( $min, $max ),
		'salaryBucket'    => md_salary_bucket( $min ),
	);
}

/**
 * Filter option lists (single source of truth, mirrors src/data/jobs.js).
 *
 * @return array
 */
function md_filter_options() {
	return array(
		'cities'      => array( 'Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven' ),
		'levels'      => array( 'junior', 'middle', 'senior' ),
		'experience'  => array(
			array( 'value' => '0-2', 'label' => '0-2' ),
			array( 'value' => '3-5', 'label' => '3-5' ),
			array( 'value' => '6+', 'label' => '6+' ),
		),
		'hours'       => array( 32, 36, 38, 40 ),
		'salary'      => array(
			array( 'value' => '0-2000', 'label' => '€0 - €2.000' ),
			array( 'value' => '2000-3000', 'label' => '€2.000 - €3.000' ),
			array( 'value' => '3000-4000', 'label' => '€3.000 - €4.000' ),
			array( 'value' => '4000+', 'label' => '€4.000+' ),
		),
	);
}

/**
 * Permalink for one of the theme's auto-created pages, by slug. Falls back to a
 * home-relative path if the page does not exist yet.
 *
 * @param string $slug Page slug, e.g. 'vacatures' or 'contact'.
 * @return string URL.
 */
function md_page_url( $slug ) {
	$page = get_page_by_path( $slug );
	if ( $page ) {
		return get_permalink( $page );
	}
	return home_url( '/' . $slug . '/' );
}

/**
 * Bilingual UI strings used by the PHP templates. Both languages are emitted
 * into the markup and toggled client-side, matching the original site.
 *
 * @return array
 */
function md_strings() {
	return array(
		'jobs' => array(
			'levels' => array(
				'nl' => array( 'junior' => 'Junior', 'middle' => 'Medior', 'senior' => 'Senior' ),
				'en' => array( 'junior' => 'Junior', 'middle' => 'Mid-level', 'senior' => 'Senior' ),
			),
		),
	);
}
