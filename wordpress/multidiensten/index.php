<?php
/**
 * Generic fallback template. Used by WordPress when no more specific template
 * matches. Runs the standard loop inside a simple padded container so any stray
 * post or page still renders with the theme's header and footer.
 *
 * @package Multidiensten
 */

get_header();
?>

	<div class="contact-page">
		<div class="contact-container">
			<?php
			while ( have_posts() ) :
				the_post();
				?>
				<h1 class="contact-title"><?php the_title(); ?></h1>
				<div class="entry-content">
					<?php the_content(); ?>
				</div>
				<?php
			endwhile;
			?>
		</div>
	</div>

<?php
get_footer();
