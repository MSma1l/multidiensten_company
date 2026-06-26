<?php
/**
 * Theme header: opens the document, prints wp_head() and the sticky site header
 * with the bilingual navigation and language switcher.
 *
 * Both languages are emitted into the markup and toggled client-side via the
 * body's lang-nl / lang-en class (see js/main.js + style.css).
 *
 * @package Multidiensten
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

	<!-- ========== HEADER ========== -->
	<header class="site-header">
		<div class="header-container">
			<a class="logo" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php echo esc_html( MD_BRAND ); ?></a>
			<div style="display: flex; align-items: center; gap: 16px;">
				<nav class="nav-buttons" id="md-nav">
					<a class="nav-btn<?php echo is_front_page() ? ' active' : ''; ?>" href="<?php echo esc_url( home_url( '/' ) ); ?>">
						<span class="hidden-nl">Home</span>
						<span class="hidden-en">Home</span>
					</a>
					<a class="nav-btn<?php echo is_page( 'vacatures' ) ? ' active' : ''; ?>" href="<?php echo esc_url( md_page_url( 'vacatures' ) ); ?>">
						<span class="hidden-nl">Vacatures</span>
						<span class="hidden-en">Opportunities</span>
					</a>
					<a class="nav-btn<?php echo is_page( 'contact' ) ? ' active' : ''; ?>" href="<?php echo esc_url( md_page_url( 'contact' ) ); ?>">
						<span class="hidden-nl">Kom in contact</span>
						<span class="hidden-en">Get in touch</span>
					</a>
				</nav>
				<div class="lang-switcher">
					<button class="lang-btn active" data-lang="nl">NL</button>
					<button class="lang-btn" data-lang="en">EN</button>
				</div>
				<button class="nav-toggle" id="md-nav-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="md-nav">
					<span></span><span></span><span></span>
				</button>
			</div>
		</div>
	</header>
