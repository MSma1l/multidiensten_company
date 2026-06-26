<?php
/**
 * Theme footer: the four-column site footer, copyright bar, wp_footer() and the
 * closing document tags. Bilingual copy is emitted for both languages.
 *
 * @package Multidiensten
 */
?>

	<!-- ========== FOOTER ========== -->
	<footer class="site-footer">
		<div class="footer-content">
			<div class="footer-column">
				<h3 class="hidden-nl">Over Ons</h3>
				<h3 class="hidden-en">About Us</h3>
				<p class="hidden-nl"><?php echo esc_html( MD_BRAND ); ?> is een wereldwijd uitzendbureau dat al meer dan 60 jaar talent verbindt met transformerende kansen.</p>
				<p class="hidden-en"><?php echo esc_html( MD_BRAND ); ?> is a global recruitment leader with 60+ years of experience connecting talent with transformative opportunities.</p>
			</div>
			<div class="footer-column">
				<h3 class="hidden-nl">Neem Contact Op</h3>
				<h3 class="hidden-en">Contact Us</h3>
				<p>info@randstad-diensten.nl</p>
				<p>+31 30 202 0202</p>
				<p>Slotlaan 314 B, 3701GX Zeist</p>
			</div>
			<div class="footer-column">
				<h3 class="hidden-nl">Sociale Media</h3>
				<h3 class="hidden-en">Social Media</h3>
				<p><a href="#">LinkedIn</a></p>
				<p><a href="#">Facebook</a></p>
				<p><a href="#">Instagram</a></p>
			</div>
			<div class="footer-column">
				<h3 class="hidden-nl">Links</h3>
				<h3 class="hidden-en">Links</h3>
				<p><a href="#"><span class="hidden-nl">Privacy</span><span class="hidden-en">Privacy</span></a></p>
				<p><a href="#"><span class="hidden-nl">Voorwaarden</span><span class="hidden-en">Terms</span></a></p>
				<p><a href="#"><span class="hidden-nl">Sitemap</span><span class="hidden-en">Sitemap</span></a></p>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; 2026 <?php echo esc_html( MD_BRAND ); ?>. <span class="hidden-nl">Alle rechten voorbehouden.</span><span class="hidden-en">All rights reserved.</span></p>
		</div>
	</footer>

	<?php wp_footer(); ?>
</body>
</html>
