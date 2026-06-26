<?php
/**
 * Vacatures page template (assigned by slug in inc/setup.php).
 *
 * Renders the bilingual filter UI and every published job as a card. All jobs
 * are output server-side; js/jobs.js handles client-side filtering & sorting
 * over the data-* attributes on each card. Both languages are emitted into the
 * markup and toggled with the body's lang-nl / lang-en class.
 *
 * @package Multidiensten
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$md_options      = md_filter_options();
$md_level_labels = array(
	'nl' => array( 'junior' => 'Junior', 'middle' => 'Medior', 'senior' => 'Senior' ),
	'en' => array( 'junior' => 'Junior', 'middle' => 'Mid-level', 'senior' => 'Senior' ),
);

$md_jobs = get_posts(
	array(
		'post_type'   => 'job',
		'numberposts' => -1,
		'post_status' => 'publish',
	)
);
?>

<div class="jobs-page">
	<div class="jobs-header">
		<h1 class="jobs-title">
			<span class="hidden-nl">Vacatures die bij U Passen</span>
			<span class="hidden-en">Opportunities That Match You</span>
		</h1>
	</div>

	<div class="filters">
		<button type="button" class="filters-toggle" aria-expanded="false" aria-controls="md-filters-grid">
			<span class="filters-toggle-label">
				<i class="fas fa-sliders"></i>
				<span class="hidden-nl">Filters</span>
				<span class="hidden-en">Filters</span>
			</span>
			<i class="fas fa-chevron-down"></i>
		</button>

		<div class="filters-grid" id="md-filters-grid" hidden>
			<div class="filter-group">
				<label class="filter-label" for="md-search">
					<span class="hidden-nl">Zoeken</span>
					<span class="hidden-en">Search</span>
				</label>
				<input
					type="text"
					id="md-search"
					class="filter-input"
					data-ph-nl="Functietitel..."
					data-ph-en="Job title..."
					placeholder="Functietitel..."
				/>
			</div>

			<div class="filter-group">
				<label class="filter-label" for="md-location">
					<span class="hidden-nl">Locatie</span>
					<span class="hidden-en">Location</span>
				</label>
				<select id="md-location" class="filter-select">
					<option value="" data-nl="Alle Steden" data-en="All Cities">Alle Steden</option>
					<?php foreach ( $md_options['cities'] as $md_city ) : ?>
						<option value="<?php echo esc_attr( $md_city ); ?>"><?php echo esc_html( $md_city ); ?></option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="filter-group">
				<label class="filter-label" for="md-level">
					<span class="hidden-nl">Ervaringsniveau</span>
					<span class="hidden-en">Experience level</span>
				</label>
				<select id="md-level" class="filter-select">
					<option value="" data-nl="Alle niveaus" data-en="All levels">Alle niveaus</option>
					<?php foreach ( $md_options['levels'] as $md_lvl ) : ?>
						<option
							value="<?php echo esc_attr( $md_lvl ); ?>"
							data-nl="<?php echo esc_attr( $md_level_labels['nl'][ $md_lvl ] ); ?>"
							data-en="<?php echo esc_attr( $md_level_labels['en'][ $md_lvl ] ); ?>"
						><?php echo esc_html( $md_level_labels['nl'][ $md_lvl ] ); ?></option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="filter-group">
				<label class="filter-label" for="md-experience">
					<span class="hidden-nl">Werkervaring</span>
					<span class="hidden-en">Experience</span>
				</label>
				<select id="md-experience" class="filter-select">
					<option value="" data-nl="Alle ervaring" data-en="All experience">Alle ervaring</option>
					<?php foreach ( $md_options['experience'] as $md_exp ) : ?>
						<option
							value="<?php echo esc_attr( $md_exp['value'] ); ?>"
							data-nl="<?php echo esc_attr( $md_exp['label'] . ' jaar' ); ?>"
							data-en="<?php echo esc_attr( $md_exp['label'] . ' years' ); ?>"
						><?php echo esc_html( $md_exp['label'] . ' jaar' ); ?></option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="filter-group">
				<label class="filter-label" for="md-hours">
					<span class="hidden-nl">Uren per week</span>
					<span class="hidden-en">Hours per week</span>
				</label>
				<select id="md-hours" class="filter-select">
					<option value="" data-nl="Alle uren" data-en="All hours">Alle uren</option>
					<?php foreach ( $md_options['hours'] as $md_h ) : ?>
						<option
							value="<?php echo esc_attr( $md_h ); ?>"
							data-nl="<?php echo esc_attr( $md_h . ' uur' ); ?>"
							data-en="<?php echo esc_attr( $md_h . ' hrs' ); ?>"
						><?php echo esc_html( $md_h . ' uur' ); ?></option>
					<?php endforeach; ?>
				</select>
			</div>

			<div class="filter-group">
				<label class="filter-label" for="md-sort">
					<span class="hidden-nl">Sorteren op</span>
					<span class="hidden-en">Sort by</span>
				</label>
				<select id="md-sort" class="filter-select">
					<option value="recommended" data-nl="Aanbevolen" data-en="Recommended">Aanbevolen</option>
					<option value="salaryDesc" data-nl="Salaris: hoog naar laag" data-en="Salary: high to low">Salaris: hoog naar laag</option>
					<option value="salaryAsc" data-nl="Salaris: laag naar hoog" data-en="Salary: low to high">Salaris: laag naar hoog</option>
				</select>
			</div>
		</div>
	</div>

	<p class="results-count" id="md-results-count"></p>

	<div class="jobs-grid" id="md-jobs-grid">
		<?php
		foreach ( $md_jobs as $md_job_post ) :
			$j         = md_get_job_data( $md_job_post->ID );
			$lvl_nl    = isset( $md_level_labels['nl'][ $j['level'] ] ) ? $md_level_labels['nl'][ $j['level'] ] : $j['level'];
			$lvl_en    = isset( $md_level_labels['en'][ $j['level'] ] ) ? $md_level_labels['en'][ $j['level'] ] : $j['level'];
			$apply_url = md_page_url( 'contact' );
			?>
			<div
				class="job-card"
				data-title="<?php echo esc_attr( $j['title'] ); ?>"
				data-titleen="<?php echo esc_attr( $j['titleEN'] ); ?>"
				data-desc="<?php echo esc_attr( $j['desc'] ); ?>"
				data-descen="<?php echo esc_attr( $j['descEN'] ); ?>"
				data-company="<?php echo esc_attr( $j['company'] ); ?>"
				data-location="<?php echo esc_attr( $j['location'] ); ?>"
				data-level="<?php echo esc_attr( $j['level'] ); ?>"
				data-experience="<?php echo esc_attr( $j['experienceYears'] ); ?>"
				data-hours="<?php echo esc_attr( $j['hoursPerWeek'] ); ?>"
				data-salarymin="<?php echo esc_attr( $j['salaryMin'] ); ?>"
				data-salarymax="<?php echo esc_attr( $j['salaryMax'] ); ?>"
				data-salarybucket="<?php echo esc_attr( $j['salaryBucket'] ); ?>"
			>
				<div class="job-top">
					<div class="job-title-block">
						<h3 class="job-title">
							<span class="hidden-nl"><?php echo esc_html( $j['title'] ); ?></span>
							<span class="hidden-en"><?php echo esc_html( $j['titleEN'] ); ?></span>
						</h3>
						<p class="job-company"><?php echo esc_html( $j['company'] ); ?></p>
					</div>
					<div class="job-salary"><?php echo esc_html( $j['salary'] ); ?></div>
				</div>

				<div class="job-tags">
					<span class="job-tag">
						<i class="fas fa-map-marker-alt"></i>
						<?php echo esc_html( $j['location'] ); ?>
					</span>
					<span class="job-tag">
						<i class="fas fa-clock"></i>
						<?php echo esc_html( $j['hoursPerWeek'] ); ?>
						<span class="hidden-nl">uur</span><span class="hidden-en">hrs</span>
					</span>
					<span class="job-tag">
						<i class="fas fa-user-tie"></i>
						<span class="hidden-nl"><?php echo esc_html( $lvl_nl ); ?></span><span class="hidden-en"><?php echo esc_html( $lvl_en ); ?></span>
					</span>
					<span class="job-tag">
						<i class="fas fa-briefcase"></i>
						<?php echo esc_html( $j['experienceYears'] ); ?>+
						<span class="hidden-nl">jaar</span><span class="hidden-en">years</span>
					</span>
				</div>

				<p class="job-desc">
					<span class="hidden-nl"><?php echo esc_html( $j['desc'] ); ?></span>
					<span class="hidden-en"><?php echo esc_html( $j['descEN'] ); ?></span>
				</p>

				<a class="job-button" href="<?php echo esc_url( $apply_url ); ?>">
					<span class="hidden-nl">Solliciteren</span>
					<span class="hidden-en">Apply Now</span>
				</a>
			</div>
		<?php endforeach; ?>
	</div>

	<p class="no-results" id="md-empty" hidden></p>
</div>

<script>
window.MD_JOBS = <?php echo wp_json_encode(
	array(
		'i18n' => array(
			'nl' => array(
				'resultsLabel'      => 'vacatures gevonden',
				'noResults'         => 'Geen vacatures gevonden met deze filters.',
				'empty'             => 'Er zijn momenteel geen vacatures beschikbaar.',
				'searchPlaceholder' => 'Functietitel...',
			),
			'en' => array(
				'resultsLabel'      => 'jobs found',
				'noResults'         => 'No openings match these filters.',
				'empty'             => 'There are currently no openings available.',
				'searchPlaceholder' => 'Job title...',
			),
		),
	)
); ?>;
</script>

<?php
get_footer();
