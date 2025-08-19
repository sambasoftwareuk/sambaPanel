import React from 'react'
import { OutlinedButton } from '../_atoms/buttons'
import TabMenu from '../_molecules/tabMenu'
import { Header1 } from '../_atoms/Headers'
import { AccordionSection } from '../_molecules/accordionSection'

const MainTabComponent = ({tabs}) => {
  return (
    <div>
        <div className="my-4">
                <Header1>Boggarts lavender robes?</Header1>
                <p>
                  Hermione Granger Fantastic Beasts and Where to Find Them. Bee in your
                  bonnet Hand of Glory elder wand, spectacles House Cup Bertie Botts
                  Every Flavor Beans Impedimenta.
                </p>
              </div>
              <div className="my-4 hidden md:block">
                <TabMenu tabs={tabs} />
              </div>
              <div className="my-4 block md:hidden">
                {tabs.map((tab, index) => (
                  <AccordionSection key={index} title={tab.title} links={tab.content} linkColor='black'/>
                  
                ))}
          
              </div>
              <div className="my-4">
                <OutlinedButton label="Show All" />
              </div>
    </div>
  )
}

export default MainTabComponent