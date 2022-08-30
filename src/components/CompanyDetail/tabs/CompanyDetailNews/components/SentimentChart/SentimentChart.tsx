import React, { useState } from 'react'
import ReactSpeedometer from 'react-d3-speedometer'
import {
  ComposedChart,
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  Line,
} from 'recharts'
import { Box, Flex } from 'theme-ui'
import { Palette } from '../../../../../../theme'
import { Paragraph } from '../../../../../primitives'
import Switch from '../../../../../Switch/Switch'
import {
  GRAY_COLOR,
  NEGATIVE_COLOR,
  POSITIVE_COLOR,
  xAxisTicksFactory,
  CHART_THREADS,
  formatSentimentChartDate,
  yAxisTicksFactory,
  formatNegativeNumberToString,
  isNullOrUndefined,
  CompanyNewsChartResult,
} from './helpers'

type Props = { companyNewsChartRes: CompanyNewsChartResult }

function SentimentChart({ companyNewsChartRes }: Props) {
  const [isThirtyDays, setIsThirtyDays] = useState<boolean>(false)

  if (!companyNewsChartRes?.sentimentChartData)
    return <Paragraph center>SENTIMENT CHART IS NOT AVAILABLE</Paragraph>

  const sentimentChartData = formatSentimentChartDate(companyNewsChartRes?.sentimentChartData)
  const yAxisTicks = yAxisTicksFactory(sentimentChartData)
  return (
    <Box sx={{ mt: 5 }}>
      <Box sx={{ textAlign: 'center', color: '#444', whiteSpace: 'pre-wrap' }}>
        <b>
          {!isNullOrUndefined(companyNewsChartRes.thirtyDaysAverage) &&
            `30 days average = ${formatNegativeNumberToString(
              companyNewsChartRes.thirtyDaysAverage
            )}\t\t`}

          {!isNullOrUndefined(companyNewsChartRes.trend) &&
            `Trend = ${formatNegativeNumberToString(companyNewsChartRes.trend)}`}
        </b>
      </Box>

      <ResponsiveContainer width="100%" height={600}>
        <ComposedChart
          data={sentimentChartData}
          barGap={-8}
          barCategoryGap={2}
          margin={{ top: 36, bottom: 36, left: 24, right: 12 }}
        >
          <CartesianGrid strokeDasharray="10 0" vertical={false} />
          <XAxis
            name="Date"
            dataKey="date"
            tickMargin={12}
            ticks={xAxisTicksFactory(sentimentChartData)}
            height={60}
          />
          <YAxis
            tickMargin={16}
            axisLine={false}
            domain={[yAxisTicks[0], yAxisTicks[yAxisTicks.length - 1]]}
            ticks={yAxisTicks}
            type="number"
            tickSize={0}
            tickCount={7}
          >
            {/* Left title */}
            <Label
              style={{ textAnchor: 'middle', fill: '#444' }}
              position="insideLeft"
              offset={-15}
              angle={-90}
            >
              {CHART_THREADS.sentimentScore}
            </Label>
          </YAxis>

          {/* margin right for show full date lable */}
          <YAxis yAxisId="right" orientation="right" tickMargin={48} axisLine={false} />

          <Tooltip />
          <Legend
            payload={[
              {
                value: CHART_THREADS.sentimentScore,
                type: 'circle',
                id: CHART_THREADS.sentimentScore,
                color: POSITIVE_COLOR,
              },
              {
                value: CHART_THREADS.sevenDaysMovingAverage,
                type: 'circle',
                id: CHART_THREADS.sevenDaysMovingAverage,
                color: GRAY_COLOR,
              },
            ]}
          />

          {/* sum positive */}
          <Bar dataKey="sumPositive" name={CHART_THREADS.sumPositive} fill={POSITIVE_COLOR} />

          {/* sum negative */}
          <Bar dataKey="sumNegative" name={CHART_THREADS.sumNegative} fill={NEGATIVE_COLOR} />

          {/* 7 days average */}
          <Line
            type="monotone"
            dataKey="sevenDaysAverage"
            name={CHART_THREADS.sevenDaysAverage}
            stroke={GRAY_COLOR}
            fill={GRAY_COLOR}
            dot={false}
            strokeWidth={3}
          />
        </ComposedChart>
      </ResponsiveContainer>

      <Flex sx={{ flexDirection: 'column', alignItems: 'center', mt: 5 }}>
        <ReactSpeedometer
          width={500}
          needleHeightRatio={0.7}
          maxValue={1}
          minValue={-1}
          value={
            (!isThirtyDays
              ? companyNewsChartRes?.thirtyDaysAverage
              : companyNewsChartRes?.thirtyDaysToSixtyDaysAverge) || 0
          }
          segments={500}
          ringWidth={45}
          needleTransitionDuration={1000}
          needleColor={Palette.primary}
          textColor={'#444'}
          maxSegmentLabels={2}
        />
        <Flex sx={{ alignItems: 'center', ml: '70px' }}>
          <Paragraph sx={{ mr: 2 }} color="#444" bold={true}>
            Thirty Days Average
          </Paragraph>
          <Switch onToggle={() => setIsThirtyDays(!isThirtyDays)} checked={isThirtyDays} />
          <Paragraph sx={{ ml: 2 }} color="#444" bold={true}>
            Thirty Days To Sixty Days Averge
          </Paragraph>
        </Flex>
      </Flex>
    </Box>
  )
}

export default SentimentChart
