import React, { useState } from 'react'
import { Box, Flex } from 'theme-ui'
import { ButtonText, Button, CompanyLogo } from '../'
import {
  CompanyOverview,
  CompanyFinancials,
  CompanyPeople,
  MappingSummary,
  Variants,
  TagNewsData,
  CompanyAcquisitionsDetail,
  CompanyIposDetail,
  CompanyAcquiree,
} from '../../types'
import strings from '../../strings'
import {
  Financials,
  Fundraising,
  Overview,
  Business,
  People,
  Acquisitions,
  Ipos,
  News,
  UseCase,
  Acquirees,
  Partnerships,
  Investments,
  Products,
  Tractions,
} from './tabs'
import { Heading, Paragraph, Section } from '../primitives'
import SideSummary from '../SideSummary'
import { ApiSourceType, EnumExpandStatus } from '../../types/enums'
import { CompanySource } from '../CompanySource'
import { ETLRunTimeContext } from '../../context'
import { Technology } from '../../pages/CompanyForm/TechnologyForm'
import { TechnologyProvider } from '../../pages/CompanyForm/TechnologyProvider'
import { Certification } from '../../pages/CompanyForm/CertificationForm'
import CompanyDetailTechnology from './tabs/CompanyDetailTechnology/CompanyDetailTechnology'
import { ColumnNames } from '../../pages/CompanyForm/helpers'

export type CompanyActionButton = {
  label: string
  variant?: Variants
  onPress(tab: string): void
}

export type CompanyDetailProps = {
  overview: CompanyOverview
  financials?: CompanyFinancials
  investments?: CompanyPeople
  fundraising?: {
    companyId: number
  }
  business?: CompanyPeople
  people?: CompanyPeople
  acquisitions?: CompanyAcquisitionsDetail
  'use-case'?: CompanyPeople
  mapping?: MappingSummary[]
  onBack(): void
  actionButton?: CompanyActionButton[]
  ipos?: CompanyIposDetail
  news?: TagNewsData
  acquirees?: CompanyAcquiree
  isExternalViewDetail?: boolean
  technology?: {
    technology: Technology[]
    technologyProvider: TechnologyProvider[]
    technologyCertification: Certification[]
  }
  partnerships?: CompanyPeople
  products?: CompanyPeople
  tractions?: CompanyPeople
  setPageCurrent(state: State): void
}

export const Tabs = {
  overview: { label: 'overview', tab: Overview },
  financials: { label: 'financials', tab: Financials },
  investments: { label: 'investments', tab: Investments },
  acquisitions: { label: 'acquisitions', tab: Acquisitions },
  acquirees: { label: 'acquirees', tab: Acquirees },
  ipos: { label: 'ipos', tab: Ipos },
  business: { label: 'business', tab: Business },
  'use-case': { label: 'use-case', tab: UseCase },
  fundraising: { label: 'fundraising', tab: Fundraising },
  technology: { label: 'technology', tab: CompanyDetailTechnology },
  people: { label: 'people', tab: People },
  news: { label: 'news', tab: News },
  partnerships: { label: 'partnerships', tab: Partnerships },
  products: { label: 'products', tab: Products },
  tractions: { label: 'tractions', tab: Tractions },
}

export type KeysTabs = keyof typeof Tabs
export type State = {
  active: KeysTabs
}

const CompanyDetail = ({
  onBack,
  actionButton,
  mapping,
  isExternalViewDetail,
  setPageCurrent,
  ...props
}: CompanyDetailProps) => {
  const [state, setState] = useState<State>({ active: 'overview' })
  const { companyDetail: copy } = strings

  const { checkTimeETL } = React.useContext(ETLRunTimeContext)

  const onClickTabs = (tab: KeysTabs) => {
    setState({ ...state, active: tab })
    setPageCurrent({ ...state, active: tab })
  }

  const buttons = Object.values(Tabs).reduce((p, c) => {
    if (props[c.label as keyof typeof props] !== undefined) {
      p.push(c.label as KeysTabs)
    }

    return p
  }, [] as KeysTabs[])

  const renderTab = () => {
    const Tab = Tabs[state.active].tab
    const data = props[state.active]

    if (!data || Tab === undefined || !Tab) return null

    return <Tab data={data as any} />
  }

  const imgSize = props.overview.expandStatus !== EnumExpandStatus.DUPLICATED ? 108 : 134

  const logoUrl =
    (isExternalViewDetail ? props?.overview.logoUrl : props?.overview.logo_bucket_url) || ''

  const isActive = state.active === ColumnNames.PRODUCTS

  return (
    <Section
      sx={{
        width: isActive ? '95vw' : '100%',
        marginLeft: isActive ? 'calc((-95vw + 1024px)/2)' : '',
        marginRight: isActive ? 'calc((-95vw + 1024px)/2)' : '',
        maxWidth: isActive ? '95vw' : '100%',
      }}
    >
      <ButtonText onPress={onBack} />
      <Flex mt={5} sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Flex sx={{ justifyContent: 'flex-start', alignItems: 'center', gap: 3 }}>
          <CompanyLogo src={logoUrl} cursor="auto" width={imgSize} height={imgSize} />
          <Box>
            <Heading as="h1">{props.overview.companyName}</Heading>
            <CompanySource
              source={props.overview.source as ApiSourceType}
              sources={props.overview.sources as ApiSourceType[]}
            />
            <Paragraph>
              {props.overview.expandStatus === EnumExpandStatus.DUPLICATED ? copy.duplicated : ''}
            </Paragraph>
          </Box>
        </Flex>
        <Flex sx={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
          {(actionButton || []).map((b, index) => (
            <Button
              key={index}
              sx={{ minWidth: 210, m: 3 }}
              onPress={() => {
                if (!checkTimeETL()) return
                b.onPress(state.active)
              }}
              label={b.label}
              variant={b.variant || 'primary'}
            />
          ))}
        </Flex>
      </Flex>
      <Box sx={{ overflow: 'hidden' }}>
        <Flex mt={6} sx={{ gap: 3, flexWrap: 'wrap' }}>
          {buttons.map((b, index) => (
            <Button
              key={index}
              active={state.active !== b}
              sx={{
                minWidth: state.active === b ? 180 : 'auto',
              }}
              onPress={() => onClickTabs(b)}
              variant={b === state.active ? 'primary' : 'muted'}
              label={copy.buttons[b as keyof typeof copy.buttons]}
            />
          ))}
        </Flex>
        {state.active === 'overview' && mapping && (
          <SideSummary
            sx={{
              bg: 'transparent',
              float: 'right',
              position: 'relative',
              maxWidth: '27%',
              mt: 6,
            }}
            content={mapping}
          />
        )}

        <Box>{renderTab()}</Box>
      </Box>
    </Section>
  )
}

export default CompanyDetail
