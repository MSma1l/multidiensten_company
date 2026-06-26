<?php
/**
 * Contact page template (assigned by slug in inc/setup.php).
 *
 * Bilingual contact form. Both NL and EN labels live in the markup and are
 * toggled via the body's lang-nl / lang-en class. js/contact.js handles client
 * validation + AJAX submit to the `md_contact_submit` action.
 *
 * @package Multidiensten
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<div class="contact-page">
	<div class="contact-container">
		<h1 class="contact-title">
			<span class="hidden-nl">Start een Gesprek</span>
			<span class="hidden-en">Start a Conversation</span>
		</h1>

		<p class="contact-subtitle">
			<span class="hidden-nl">Stuur uw gegevens en wij nemen snel contact met u op om uw ideale kansen te bespreken</span>
			<span class="hidden-en">Send your details and we will contact you shortly to discuss your ideal opportunities.</span>
		</p>

		<form class="contact-form" id="md-contact-form" novalidate enctype="multipart/form-data">
			<div class="form-row">
				<div class="form-group">
					<label for="md-first-name">
						<span class="hidden-nl">Voornaam</span>
						<span class="hidden-en">First Name</span>
					</label>
					<input
						type="text"
						id="md-first-name"
						name="first_name"
						data-ph-nl="Uw voornaam"
						data-ph-en="Your first name"
						placeholder="Uw voornaam"
					/>
					<span class="field-error" data-error-for="first_name"></span>
				</div>

				<div class="form-group">
					<label for="md-last-name">
						<span class="hidden-nl">Achternaam</span>
						<span class="hidden-en">Last Name</span>
					</label>
					<input
						type="text"
						id="md-last-name"
						name="last_name"
						data-ph-nl="Uw achternaam"
						data-ph-en="Your last name"
						placeholder="Uw achternaam"
					/>
					<span class="field-error" data-error-for="last_name"></span>
				</div>
			</div>

			<div class="form-group">
				<label for="md-email">
					<span class="hidden-nl">E-mailadres</span>
					<span class="hidden-en">Email Address</span>
				</label>
				<input type="email" id="md-email" name="email" />
				<span class="field-error" data-error-for="email"></span>
			</div>

			<div class="form-group">
				<label for="md-phone">
					<span class="hidden-nl">Telefoonnummer</span>
					<span class="hidden-en">Phone Number</span>
				</label>
				<input type="tel" id="md-phone" name="phone" />
				<span class="field-error" data-error-for="phone"></span>
			</div>

			<div class="form-group">
				<label for="md-message">
					<span class="hidden-nl">Bericht</span>
					<span class="hidden-en">Message</span>
				</label>
				<textarea
					id="md-message"
					name="message"
					data-ph-nl="Vertel ons over uzelf..."
					data-ph-en="Tell us about yourself..."
					placeholder="Vertel ons over uzelf..."
				></textarea>
				<span class="field-error" data-error-for="message"></span>
			</div>

			<div class="form-group">
				<label for="md-cv">
					<span class="hidden-nl">CV (optioneel)</span>
					<span class="hidden-en">CV (optional)</span>
				</label>
				<input type="file" id="md-cv" name="cv" accept=".pdf,.doc,.docx" />
				<span class="field-error" data-error-for="cv"></span>
			</div>

			<button type="submit" class="submit-btn" id="md-submit">
				<span class="hidden-nl">Verzoek Versturen</span>
				<span class="hidden-en">Send Request</span>
			</button>

			<div class="form-message" id="md-form-message"></div>
		</form>
	</div>
</div>

<?php
get_footer();
