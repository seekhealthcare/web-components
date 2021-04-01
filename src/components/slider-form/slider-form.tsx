import axios from 'axios';
import { Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { RefObject, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Slider from 'react-slick';

import { ICampaignInfo, IRequestCallFormValues } from '../../interfaces';
import {
  AutocompleteInputField,
  CircularSpinner,
  ConfirmDialog,
  CustomButton,
  IAddressInfo,
  InputField
} from '../index';
import generateRequestCallSchema, {
  IRequestCallSchema,
  validateAddress,
  validateEmail,
  validateNames,
  validatPhoneNumber
} from './slider-form.validation';

import './slider-form.scss';

const AVAILABLE_TEXT =
  'Looks like we have many available plans in that area!  Go ahead and submit and we’ll be in touch soon!';

const NOT_AVAILABLE_TEXT =
  'We’re not available in your area just yet, but go ahead and submit and we’ll be sure to contact you when we are! ';

const defaultStrings = {
  secondSldie: {
    nice: 'Nice to meet you, ',
    email: '! What’s your email address?',
    text: 'We’ll need your email to contact you about your plan information...'
  },
  thirdSlide: {
    title: 'Thanks!  What phone number is best to reach you?',
    text: 'One of our agents will call you on this number to discuss the best plans for you.'
  },
  fourthSlide: {
    last: 'Last question, ',
    address: '! What is your address?',
    text: 'We need your address to look up the right plans that are available in your area.'
  }
};

export interface ISlidingRequestCallForm {
  config: {
    strings: {
      slideText: string;
      slideTitle: string;
      legalText: string;
      submitBtnText: string;
    };
    colors: {
      blueButton: string;
    };
    helperFuncs: {
      getCampaignInfo: (route: string, formValues: IRequestCallFormValues | undefined) => ICampaignInfo;
      isSupportedZip: (zip: string) => boolean;
    };
    urls: {
      recaptchaKey: string | undefined;
      formSubmitApi: string | undefined;
      thankYouPage: string;
    };
  };
  formValues?: IRequestCallFormValues;
}

export const SlidingRequestCallForm: React.FC<ISlidingRequestCallForm> = ({ config, formValues }) => {
  const router = useRouter();
  const initialValues: IRequestCallSchema = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    apartment: ''
  };

  const sliderSettings = {
    arrows: false,
    draggable: false,
    infinite: false,
    initialSlide: 0,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const [openModal, setOpenModal] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [slider, setSlider] = useState({} as Slider);
  const [isFirstSlideValid, setIsFirstSlideValid] = useState(false);
  const [isSecondSlideValid, setIsSecondSlideValid] = useState(false);
  const [isThirdSlideValid, setIsThirdSlideValid] = useState(false);
  const [isFourthSlideValid, setIsFourthSlideValid] = useState(false);
  const [supportedZipMsg, setSupportedZipMsg] = useState('');
  const [addressInfo, setAddressInfo] = useState({} as IAddressInfo);
  const recaptchaRef = useRef<ReCAPTCHA>() as RefObject<ReCAPTCHA>;

  const { strings, colors, helperFuncs, urls } = config;

  const handleClose = (): void => {
    setOpenModal(false);
  };

  const showError = (): void => {
    setMessageSent(false);
    setOpenModal(true);
  };

  const handleOnSubmit = async (values: IRequestCallSchema): Promise<void> => {
    const campaignInfo: ICampaignInfo = helperFuncs.getCampaignInfo(router.route, formValues);
    const token = await recaptchaRef.current?.executeAsync().catch(() => {
      showError();
    });
    recaptchaRef.current?.reset();

    const streetAddress =
      values.apartment.trim().length > 0
        ? `${addressInfo.streetAddress}, APT/UNIT ${values.apartment}`
        : addressInfo.streetAddress;

    const data = {
      first_name: values.firstName,
      last_name: values.lastName,
      phone: values.phoneNumber,
      email: values.email,
      zipCode: addressInfo.zip,
      street_address: streetAddress,
      city: addressInfo.city,
      state: addressInfo.state,
      recaptchaToken: token,
      utm_campaign: campaignInfo.utmCampaign,
      utm_content: campaignInfo.utmContent,
      utm_medium: campaignInfo.utmMedium,
      utm_source: campaignInfo.utmSource,
      lead_source: campaignInfo.leadSource
    };

    try {
      const response = await axios.post(`${urls.formSubmitApi}`, data, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response?.data) {
        setMessageSent(true);
        router.push(urls.thankYouPage);
      } else {
        showError();
      }
    } catch (err) {
      showError();
    }
  };

  const getAddressInfo = (info: IAddressInfo | null): void => {
    const mapDiv = document.getElementById('map') as HTMLElement;

    if (info) {
      setAddressInfo(info);
      const addressLoc = { lat: info.lat, lng: info.lng };
      initMap(mapDiv, addressLoc);
      mapDiv.style.height = '150px';
      helperFuncs.isSupportedZip(info.zip)
        ? setSupportedZipMsg(AVAILABLE_TEXT)
        : setSupportedZipMsg(NOT_AVAILABLE_TEXT);
    } else {
      mapDiv.style.height = '0';
      setSupportedZipMsg('');
    }
  };

  const initMap = (mapDiv: HTMLElement, location: { lat: number; lng: number }): void => {
    const map = new google.maps.Map(mapDiv, {
      zoom: 16,
      center: location
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const marker = new google.maps.Marker({
      position: location,
      map: map
    });
  };

  const validate = async (values: IRequestCallSchema): Promise<void> => {
    setIsFirstSlideValid(await validateNames(values.firstName, values.lastName));
    setIsSecondSlideValid(await validateEmail(values.email));
    setIsThirdSlideValid(await validatPhoneNumber(values.phoneNumber));
    setIsFourthSlideValid(await validateAddress(values.address));
  };

  const prevSlide = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    e.preventDefault();
    slider.slickPrev();
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleOnSubmit}
        validationSchema={generateRequestCallSchema}
        validate={validate}
      >
        {(props) => {
          const { isValid, dirty, isSubmitting, values } = props;
          return (
            <>
              <CircularSpinner isLoading={isSubmitting} />

              <form className="form-wrapper">
                <Slider ref={(slider) => slider && setSlider(slider)} {...sliderSettings}>
                  {/* FIRST SLIDE */}
                  <div className="form-input-container">
                    <div className="text-container">
                      <h1 className="text-title" id="walgreens-title">
                        {strings.slideTitle}
                      </h1>
                      <span className="text" id="walgreens-text">
                        {strings.slideText}
                      </span>
                    </div>
                    <div className="form-inputs">
                      <div>
                        <InputField name="firstName" type="text" placeholder="First Name *" />
                      </div>
                      <div className="last-name-input">
                        <InputField name="lastName" type="text" placeholder="Last Name *" />
                      </div>
                    </div>
                    <div className="slider-buttons-section">
                      <div className="slider-button-container">
                        <CustomButton
                          id="next-1st-slide"
                          type="button"
                          text="Next"
                          disabled={!isFirstSlideValid}
                          onClick={() => slider.slickNext()}
                          className={colors.blueButton}
                        />
                      </div>
                    </div>
                  </div>
                  {/* SECOND SLIDE */}
                  <div className="form-input-container">
                    <div className="form-input">
                      <div className="text-container">
                        <h1 className="text-title" id="walgreens-title">
                          {defaultStrings.secondSldie.nice}
                          {values.firstName}
                          {defaultStrings.secondSldie.email}
                        </h1>
                        <span className="text" id="walgreens-text">
                          {defaultStrings.secondSldie.text}
                        </span>
                      </div>
                      <div className="large-input">
                        <InputField name="email" type="text" placeholder="Email Address" />
                      </div>
                    </div>

                    <div className="slider-buttons-section">
                      <div>
                        <a onClick={(e) => prevSlide(e)} href="">
                          <img src={require('../../static/img/arrow-back.svg')} alt="Prev" />
                        </a>
                      </div>
                      <div className="slider-button-container">
                        <CustomButton
                          id="next-2nd-slide"
                          type="button"
                          text="Next"
                          disabled={!isSecondSlideValid}
                          onClick={() => slider.slickNext()}
                          className={colors.blueButton}
                        />
                      </div>
                    </div>
                  </div>
                  {/* THIRD SLIDE */}
                  <div className="form-input-container">
                    <div className="form-input">
                      <div className="text-container">
                        <h1 className="text-title" id="walgreens-title">
                          {defaultStrings.thirdSlide.title}
                        </h1>
                        <span className="text" id="walgreens-text">
                          {defaultStrings.thirdSlide.text}
                        </span>
                      </div>
                      <div className="large-input">
                        <InputField name="phoneNumber" type="tel" placeholder="Phone Number *" />
                      </div>
                    </div>
                    <div className="slider-buttons-section">
                      <div>
                        <a onClick={(e) => prevSlide(e)} href="">
                          <img src={require('../../static/img/arrow-back.svg')} alt="Prev" />
                        </a>
                      </div>
                      <div className="slider-button-container">
                        <CustomButton
                          id="next-3rd-slide"
                          type="button"
                          text="Next"
                          disabled={!isThirdSlideValid}
                          onClick={() => slider.slickNext()}
                          className={colors.blueButton}
                        />
                      </div>
                    </div>
                  </div>
                  {/* FOURTH SLIDE */}
                  <div className="form-input-container">
                    <div className="text-container">
                      <h1 className="text-title" id="walgreens-title">
                        {defaultStrings.fourthSlide.last}
                        {values.firstName}
                        {defaultStrings.fourthSlide.address}
                      </h1>
                      <span className="text" id="walgreens-text">
                        {defaultStrings.fourthSlide.text}
                      </span>
                    </div>
                    <div id="map"></div>
                    <div className="address-form-inputs">
                      <div className="autocomplete-input">
                        <AutocompleteInputField
                          id="address-autocomplete"
                          name="address"
                          placeholder="Street Address, City, State *"
                          getAddressInfo={getAddressInfo}
                        />
                      </div>
                      <div className="apartment-input">
                        <InputField name="apartment" type="text" placeholder="APT/UNIT #" />
                      </div>
                    </div>
                    {<h3 id="not-available-title"> {supportedZipMsg}</h3>}
                    <div className="slider-buttons-section">
                      <div>
                        <a onClick={(e) => prevSlide(e)} href="">
                          <img src={require('../../static/img/arrow-back.svg')} alt="Prev" />
                        </a>
                      </div>
                      <div className="slider-button-container">
                        <CustomButton
                          id="submit-btn"
                          type="button"
                          text={strings.submitBtnText}
                          onClick={() => props.handleSubmit()}
                          className={colors.blueButton}
                          disabled={!dirty || !isValid || isSubmitting || !isFourthSlideValid}
                          isSubmitting={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="terms-container">
                      <span className="terms-text" dangerouslySetInnerHTML={{ __html: strings.legalText }}></span>
                    </div>
                  </div>
                </Slider>
                <ReCAPTCHA ref={recaptchaRef} sitekey={urls.recaptchaKey || ''} size="invisible" />
              </form>
            </>
          );
        }}
      </Formik>
      <ConfirmDialog open={openModal} messageSent={messageSent} onClose={handleClose} />
    </>
  );
};
