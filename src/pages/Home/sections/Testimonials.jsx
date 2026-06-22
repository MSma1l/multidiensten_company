import { useLanguage } from '../../../context/LanguageContext.jsx'
import SectionHeader from '../../../components/SectionHeader/SectionHeader.jsx'
import Carousel from '../../../components/Carousel/Carousel.jsx'
import styles from './Testimonials.module.css'

export default function Testimonials() {
  const { t } = useLanguage()

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <SectionHeader title={t.testimonials.title} subtitle={t.testimonials.subtitle} />

        <Carousel
          items={t.testimonials.items}
          getKey={(item) => item.name}
          perView={3}
          autoPlayMs={2000}
          ariaLabel={t.testimonials.title}
          renderItem={(item) => (
            <div className={styles.card}>
              <div className={styles.rating}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={styles.star}>
                    ★
                  </span>
                ))}
              </div>
              <p className={styles.text}>{item.text}</p>
              <div className={styles.author}>
                <div className={styles.avatar}>{item.initials}</div>
                <div>
                  <h4 className={styles.name}>{item.name}</h4>
                  <div className={styles.job}>{item.job}</div>
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
