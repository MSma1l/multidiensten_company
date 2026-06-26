<?php
/**
 * Front page (Home). Replicates the original design's home sections in order:
 * hero, quick stats, features, about, testimonials and the closing CTA block.
 *
 * All copy is emitted in both NL and EN and toggled client-side via the body
 * language class. Navigation buttons link to the real Vacatures / Contact pages.
 *
 * @package Multidiensten
 */

get_header();

$vacatures_url = esc_url( md_page_url( 'vacatures' ) );
$contact_url   = esc_url( md_page_url( 'contact' ) );
?>

	<!-- HERO -->
	<section class="hero">
		<div class="hero-content">
			<h1 class="hidden-nl">Begin uw Carrièretransformatie</h1>
			<h1 class="hidden-en">Begin Your Career Transformation</h1>

			<p class="hidden-nl">Tienduizenden professionals vertrouwen op ons om hun beste werkkansen te vinden. Bent u klaar om te groeien?</p>
			<p class="hidden-en">Tens of thousands of professionals trust us to discover their ideal career paths. Are you ready to advance?</p>

			<div class="hero-buttons">
				<a class="btn btn-primary" href="<?php echo $vacatures_url; ?>">
					<span class="hidden-nl">Vacatures Bekijken</span>
					<span class="hidden-en">Browse Opportunities</span>
				</a>
				<a class="btn btn-secondary" href="<?php echo $contact_url; ?>">
					<span class="hidden-nl">Schrijf u nu in</span>
					<span class="hidden-en">Apply Today</span>
				</a>
			</div>
		</div>
	</section>

	<!-- QUICK STATS -->
	<section class="quick-stats">
		<div class="quick-stats-container">
			<div class="quick-stat">
				<div class="quick-stat-icon"><i class="fas fa-users"></i></div>
				<div class="quick-stat-number">185K+</div>
				<div class="quick-stat-label hidden-nl">Aangenomen Professionals</div>
				<div class="quick-stat-label hidden-en">Professionals Hired</div>
				<div class="quick-stat-text hidden-nl">Alleen dit jaar al</div>
				<div class="quick-stat-text hidden-en">This year alone</div>
			</div>

			<div class="quick-stat">
				<div class="quick-stat-icon"><i class="fas fa-briefcase"></i></div>
				<div class="quick-stat-number">5000+</div>
				<div class="quick-stat-label hidden-nl">Openstaande Vacatures</div>
				<div class="quick-stat-label hidden-en">Open Positions</div>
				<div class="quick-stat-text hidden-nl">Nu beschikbaar</div>
				<div class="quick-stat-text hidden-en">Ready now</div>
			</div>

			<div class="quick-stat">
				<div class="quick-stat-icon"><i class="fas fa-star"></i></div>
				<div class="quick-stat-number">4.9/5</div>
				<div class="quick-stat-label hidden-nl">Klantbeoordelingen</div>
				<div class="quick-stat-label hidden-en">Client Ratings</div>
				<div class="quick-stat-text hidden-nl">Van 10.000+ gebruikers</div>
				<div class="quick-stat-text hidden-en">From 10K+ users</div>
			</div>

			<div class="quick-stat">
				<div class="quick-stat-icon"><i class="fas fa-handshake"></i></div>
				<div class="quick-stat-number">100%</div>
				<div class="quick-stat-label hidden-nl">Volledige Toewijding</div>
				<div class="quick-stat-label hidden-en">Full Commitment</div>
				<div class="quick-stat-text hidden-nl">Voor uw succes</div>
				<div class="quick-stat-text hidden-en">To your success</div>
			</div>
		</div>
	</section>

	<!-- FEATURES SECTION -->
	<section class="features-section">
		<div class="features-container">
			<div class="section-header">
				<h2 class="section-title hidden-nl">Waarom Voor Ons Kiezen</h2>
				<h2 class="section-title hidden-en">Why Choose Us</h2>
				<p class="section-subtitle hidden-nl">Wij bieden veel meer dan banen: wij bieden carrièretransformatie</p>
				<p class="section-subtitle hidden-en">We offer more than jobs: we offer career transformation</p>
			</div>

			<div class="md-carousel" data-autoplay="2000">
				<div class="md-carousel-viewport">
					<button class="md-carousel-arrow md-carousel-prev" type="button" aria-label="Vorige"><i class="fas fa-chevron-left"></i></button>
					<div class="md-carousel-track" style="--per:3">
						<div class="md-carousel-slide">
							<div class="feature-card">
								<div class="feature-icon"><i class="fas fa-magic"></i></div>
								<h3 class="feature-title hidden-nl">Perfecte Match</h3>
								<h3 class="feature-title hidden-en">Perfect Match</h3>
								<p class="feature-desc hidden-nl">Geavanceerde algoritmes koppelen uw vaardigheden aan ideale vacatures</p>
								<p class="feature-desc hidden-en">Advanced algorithms match your skills with ideal opportunities</p>
							</div>
						</div>
						<div class="md-carousel-slide">
							<div class="feature-card">
								<div class="feature-icon"><i class="fas fa-chart-line"></i></div>
								<h3 class="feature-title hidden-nl">Carrièregroei</h3>
								<h3 class="feature-title hidden-en">Career Growth</h3>
								<p class="feature-desc hidden-nl">Gratis trainingen en exclusieve mentorprogramma&rsquo;s</p>
								<p class="feature-desc hidden-en">Free training and exclusive mentoring programs</p>
							</div>
						</div>
						<div class="md-carousel-slide">
							<div class="feature-card">
								<div class="feature-icon"><i class="fas fa-coins"></i></div>
								<h3 class="feature-title hidden-nl">Concurrerend Salaris</h3>
								<h3 class="feature-title hidden-en">Competitive Pay</h3>
								<p class="feature-desc hidden-nl">Wij garanderen de beste salarisonderhandelingen op de markt</p>
								<p class="feature-desc hidden-en">We guarantee the best salary negotiations in the market</p>
							</div>
						</div>
						<div class="md-carousel-slide">
							<div class="feature-card">
								<div class="feature-icon"><i class="fas fa-shield-alt"></i></div>
								<h3 class="feature-title hidden-nl">Vertrouwen en Veiligheid</h3>
								<h3 class="feature-title hidden-en">Trust &amp; Safety</h3>
								<p class="feature-desc hidden-nl">60+ jaar ervaring en miljoenen professionals die op ons vertrouwen</p>
								<p class="feature-desc hidden-en">60+ years of experience with millions trusting us</p>
							</div>
						</div>
						<div class="md-carousel-slide">
							<div class="feature-card">
								<div class="feature-icon"><i class="fas fa-hourglass-half"></i></div>
								<h3 class="feature-title hidden-nl">Volledige Flexibiliteit</h3>
								<h3 class="feature-title hidden-en">Total Flexibility</h3>
								<p class="feature-desc hidden-nl">Kies tussen fulltime, parttime of tijdelijk werk</p>
								<p class="feature-desc hidden-en">Choose between full-time, part-time or temporary work</p>
							</div>
						</div>
						<div class="md-carousel-slide">
							<div class="feature-card">
								<div class="feature-icon"><i class="fas fa-handshake"></i></div>
								<h3 class="feature-title hidden-nl">Persoonlijke Ondersteuning</h3>
								<h3 class="feature-title hidden-en">Personal Support</h3>
								<p class="feature-desc hidden-nl">Uw toegewijde recruiter staat altijd voor u klaar</p>
								<p class="feature-desc hidden-en">Your dedicated recruiter is always ready to help</p>
							</div>
						</div>
					</div>
					<button class="md-carousel-arrow md-carousel-next" type="button" aria-label="Volgende"><i class="fas fa-chevron-right"></i></button>
				</div>
				<div class="md-carousel-dots"></div>
			</div>
		</div>
	</section>

	<!-- ABOUT SECTION -->
	<section class="about-section">
		<div class="about-container">
			<div class="about-content">
				<h2 class="hidden-nl">Uw Perfecte Carrière Wacht op U</h2>
				<h2 class="hidden-en">Your Ideal Career Awaits</h2>

				<p class="hidden-nl">Wij zijn gespecialiseerd in het verbinden van talent met kansen in de sectoren <strong>logistiek, productie, technologie, opslag en handel</strong>. Onze diepgaande ervaring in deze markten stelt ons in staat de perfecte matches te maken.</p>
				<p class="hidden-en">We excel at connecting talent with opportunities in <strong>logistics, manufacturing, technology, warehousing and commerce</strong>. Our deep industry expertise enables perfect career matches.</p>

				<p class="hidden-nl"><strong>Vanuit onze vestigingen in Gelderland, Limburg en Noord-Brabant,</strong> werken wij met persoonlijke aandacht en hechte relaties. Uw carrièretransformatie is onze missie.</p>
				<p class="hidden-en"><strong>Operating from offices in Gelderland, Limburg and North Brabant,</strong> we build lasting professional relationships. Your career transformation is our mission.</p>

				<div class="about-buttons">
					<a class="btn-about btn-about-primary" href="<?php echo $vacatures_url; ?>">
						<span class="hidden-nl">Vind Uw Baan <i class="fas fa-arrow-right"></i></span>
						<span class="hidden-en">Find Your Role <i class="fas fa-arrow-right"></i></span>
					</a>
					<a class="btn-about btn-about-secondary" href="<?php echo $contact_url; ?>">
						<span class="hidden-nl">Praat Met Ons <i class="fas fa-arrow-right"></i></span>
						<span class="hidden-en">Talk With Us <i class="fas fa-arrow-right"></i></span>
					</a>
				</div>
			</div>

			<div class="about-image">
				<img src="<?php echo esc_url( MD_THEME_URI . '/assets/about.jpg' ); ?>" alt="">
			</div>
		</div>
	</section>

	<!-- TESTIMONIALS SECTION -->
	<section class="testimonials-section">
		<div class="testimonials-container">
			<div class="section-header">
				<h2 class="section-title hidden-nl">Succesverhalen</h2>
				<h2 class="section-title hidden-en">Success Stories</h2>
				<p class="section-subtitle hidden-nl">Professionals die hun leven veranderden dankzij onze vacatures</p>
				<p class="section-subtitle hidden-en">Professionals who transformed their lives through our opportunities</p>
			</div>

			<div class="md-carousel" data-autoplay="2000">
				<div class="md-carousel-viewport">
					<button class="md-carousel-arrow md-carousel-prev" type="button" aria-label="Vorige"><i class="fas fa-chevron-left"></i></button>
					<div class="md-carousel-track" style="--per:3">
						<div class="md-carousel-slide">
							<div class="testimonial-card">
								<div class="rating">
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
								</div>
								<p class="testimonial-text hidden-nl">"Randstad-Diensten heeft mijn carrière getransformeerd. Het proces was eenvoudig, snel en professioneel. Binnen enkele dagen had ik mijn perfecte nieuwe baan!"</p>
								<p class="testimonial-text hidden-en">"Randstad-Diensten transformed my career. The process was smooth, fast and professional. Within days, I was in my perfect new role!"</p>
								<div class="testimonial-author">
									<div class="author-avatar">MP</div>
									<div class="author-info">
										<h4>Miguel Pereira</h4>
										<div class="author-job hidden-nl">Technisch Specialist</div>
										<div class="author-job hidden-en">Technical Specialist</div>
									</div>
								</div>
							</div>
						</div>
						<div class="md-carousel-slide">
							<div class="testimonial-card">
								<div class="rating">
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
								</div>
								<p class="testimonial-text hidden-nl">"Het team van Randstad-Diensten was geweldig! Ze vonden niet alleen de juiste baan, maar bereidden me ook voor op succes."</p>
								<p class="testimonial-text hidden-en">"The Randstad-Diensten team was amazing! Not only did they find the right job, they prepared me for success."</p>
								<div class="testimonial-author">
									<div class="author-avatar">CF</div>
									<div class="author-info">
										<h4>Carla Fernandes</h4>
										<div class="author-job hidden-nl">Projectmanager</div>
										<div class="author-job hidden-en">Project Manager</div>
									</div>
								</div>
							</div>
						</div>
						<div class="md-carousel-slide">
							<div class="testimonial-card">
								<div class="rating">
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
									<span class="star">★</span>
								</div>
								<p class="testimonial-text hidden-nl">"Mijn salaris verdrievoudigen? Ja! Randstad-Diensten heeft een geweldig pakket voor mij onderhandeld. Bedankt voor de toewijding!"</p>
								<p class="testimonial-text hidden-en">"Triple my salary? Yes! Randstad-Diensten negotiated an incredible package for me. Thank you for the dedication!"</p>
								<div class="testimonial-author">
									<div class="author-avatar">JL</div>
									<div class="author-info">
										<h4>João Lucas</h4>
										<div class="author-job hidden-nl">Financieel Analist</div>
										<div class="author-job hidden-en">Financial Analyst</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<button class="md-carousel-arrow md-carousel-next" type="button" aria-label="Volgende"><i class="fas fa-chevron-right"></i></button>
				</div>
				<div class="md-carousel-dots"></div>
			</div>
		</div>
	</section>

	<!-- BLOCK / CTA SECTION -->
	<section class="block-section">
		<div class="block-container">
			<h2 class="block-title hidden-nl">Uw Volgende Grote Kans</h2>
			<h2 class="block-title hidden-en">Your Next Big Opportunity</h2>

			<p class="block-subtitle hidden-nl">Honderdduizenden hebben hun carrière al via ons getransformeerd. Nu is het uw beurt om nieuwe professionele hoogten te bereiken!</p>
			<p class="block-subtitle hidden-en">Hundreds of thousands have already transformed their careers with us. Now it's your turn to reach new professional heights!</p>

			<div class="block-buttons">
				<a class="btn-block btn-block-primary" href="<?php echo $vacatures_url; ?>">
					<span class="hidden-nl">Ontdek Vacatures</span>
					<span class="hidden-en">Discover Openings</span>
				</a>
				<a class="btn-block btn-block-secondary" href="<?php echo $contact_url; ?>">
					<span class="hidden-nl">Deel Uw CV</span>
					<span class="hidden-en">Submit Your Profile</span>
				</a>
			</div>
		</div>
	</section>

<?php
get_footer();
