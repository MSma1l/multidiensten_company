import { useLanguage } from '../../../context/LanguageContext.jsx'
import SectionHeader from '../../../components/SectionHeader/SectionHeader.jsx'
import Carousel from '../../../components/Carousel/Carousel.jsx'
import styles from './Features.module.css'

export default function Features() {
  const { t } = useLanguage()

  return (
    <section className={styles.features}>
      <div className={styles.container}>
        <SectionHeader title={t.features.title} subtitle={t.features.subtitle} />

        <Carousel
          items={t.features.items}
          getKey={(feature) => feature.title}
          perView={3}
          autoPlayMs={2000}
          ariaLabel={t.features.title}
          renderItem={(feature) => (
            <div className={styles.card}>
              <div className={styles.icon}>
                <i className={`fas ${feature.icon}`}></i>
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.desc}>{feature.desc}</p>
            </div>
          )}
        />
      </div>
    </section>
  )
}
