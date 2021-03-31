import * as React from 'react';

import { Meta, Story } from '@storybook/react/types-6-0';

import { ISlidingRequestCallForm, SlidingRequestCallForm } from './slider-form';

export default {
  title: 'Slider Form',
  component: SlidingRequestCallForm,
  description: `A Sliding form.`,
  argTypes: {
    config: {
      strings: {
        slideText: { control: 'text' },
        slideTitle: { control: 'text' },
        legalText: { control: 'text' },
        submitBtnText: { control: 'text' }
      },
      colors: {
        blueButton: { control: 'color' }
      }
    }
  }
} as Meta;

const Template: Story<ISlidingRequestCallForm> = (args) => <SlidingRequestCallForm {...args} />;
const sliderConfig = {
  config: {
    strings: {
      slideText: 'Some custom text for the first slide',
      slideTitle: 'Some Custom title for the first slide',
      legalText: 'Some custom legal text for the last slide',
      submitBtnText: 'Agree and submit'
    },
    colors: {
      blueButton: 'red'
    },
    helperFuncs: {
      getCampaignInfo: () => {
        return {
          utmCampaign: 'utmCamptaign',
          utmSource: 'utmSource',
          utmMedium: 'utmMedium',
          utmContent: 'utmContent',
          leadSource: 'leadSource'
        };
      },
      isSupportedZip: () => true
    },
    urls: {
      recaptchaKey: 'the recaptcha key',
      formSubmitApi: 'form submit api url',
      thankYouPage: 'Link to the thank you page'
    }
  }
};

export const Default = Template.bind({});
Default.args = sliderConfig;

// export const CustomText = Template.bind({});
// if (CustomText.args) {
//   CustomText.args.config.strings = {
//     slideText: 'Some custom text for the first slide',
//     slideTitle: 'Some custom title for the first slide',
//     legalText: 'Custom legal text for the last slide',
//     submitBtnText: 'Agree and Submit'
//   };
// }
