import parse from 'autosuggest-highlight/parse';
import { useField } from 'formik';
import React, { ReactElement, useMemo } from 'react';

import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AutocompleteRenderInputParams } from '@material-ui/lab/Autocomplete/Autocomplete';

import './autocomplete-input-field.scss';

export interface IAddressInfo {
  zip: string;
  lat: number;
  lng: number;
  streetAddress: string;
  city: string;
  state: string;
}

export interface IGoogleInputField {
  id: string;
  name: string;
  placeholder?: string;
  getAddressInfo: (info: IAddressInfo | null) => void;
}

const autocompleteService: { current: google.maps.places.AutocompleteService | null } = { current: null };

export const AutocompleteInputField: React.FC<IGoogleInputField> = ({ id, name, placeholder, getAddressInfo }) => {
  const [value, setValue] = React.useState<google.maps.places.AutocompletePrediction | null>(null);
  const [options, setOptions] = React.useState<google.maps.places.AutocompletePrediction[]>([]);
  const [field, meta, helpers] = useField(name);
  const error = meta.touched ? meta.error : '';

  const fetch = useMemo(
    () => (
      request: google.maps.places.AutocompletionRequest,
      callback: (
        results: google.maps.places.AutocompletePrediction[],
        state?: google.maps.places.PlacesServiceStatus
      ) => void
    ) => {
      if (autocompleteService.current) {
        autocompleteService.current.getPlacePredictions(request, callback);
      }
    },
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }
    if (field.value === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    const request = {
      input: field.value,
      types: ['address'],
      componentRestrictions: { country: ['US'] }
    };

    const callback = (results: google.maps.places.AutocompletePrediction[]): void => {
      if (active) {
        let newOptions: google.maps.places.AutocompletePrediction[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    };

    fetch(request, callback);

    return () => {
      active = false;
    };
  }, [value, field.value, fetch]);

  const handleInputChange = (event: React.ChangeEvent<unknown>, value: string): void => {
    if (!meta.touched) {
      helpers.setTouched(true);
    }
    helpers.setValue(value);
  };

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    newValue: google.maps.places.AutocompletePrediction | null
  ): void => {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    if (newValue) {
      service.getDetails(
        {
          placeId: newValue.place_id,
          fields: ['address_components', 'geometry']
        },
        (res) => {
          const location = res?.geometry?.location;
          const zipCode = res?.address_components?.find((field) => field.types[0] === 'postal_code');
          const streetNumber = res?.address_components?.find((field) => field.types[0] === 'street_number');
          const route = res?.address_components?.find((field) => field.types[0] === 'route');
          const streetAddress = streetNumber ? streetNumber.long_name + ' ' + route?.long_name : route?.long_name;
          let city = res?.address_components?.find((field) => field.types[0] === 'locality');
          const state = res?.address_components?.find((field) => field.types[0] === 'administrative_area_level_1');

          if (!city) {
            city = res?.address_components?.find((field) => field.types[0] === 'sublocality_level_1');
          }

          if (zipCode && location && city && state && streetAddress) {
            const info: IAddressInfo = {
              zip: zipCode.long_name,
              lat: location.lat(),
              lng: location.lng(),
              streetAddress,
              city: city.long_name,
              state: state.short_name
            };
            getAddressInfo(info);
          }
        }
      );
    } else {
      getAddressInfo(null);
    }
    setOptions(newValue ? [newValue, ...options] : options);
    setValue(newValue);
  };

  const errorBlock = (): ReactElement => (
    <div className="error-container">
      <span className="error-text">{error}</span>
    </div>
  );

  const renderInput = (params: AutocompleteRenderInputParams): ReactElement => (
    <>
      <div className="custom-text-field">
        <TextField
          {...params}
          name={name}
          placeholder={placeholder}
          type="text"
          inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
        />
      </div>
      {errorBlock()}
    </>
  );

  const getOptionLabel = (option: string | google.maps.places.AutocompletePrediction): string => {
    return typeof option === 'string' ? option : option.description;
  };

  const renderOption = (option: google.maps.places.AutocompletePrediction): ReactElement => {
    const matches = option.structured_formatting.main_text_matched_substrings;
    const parts = parse(
      option.structured_formatting.main_text,
      matches.map((match: google.maps.places.PredictionSubstring) => [match.offset, match.offset + match.length])
    );

    return (
      <Grid container alignItems="center">
        <Grid item>
          <img src={require('../../static/img/location.svg')} alt="location" className="location-icon" />
        </Grid>
        <Grid item>
          {parts.map((part, index) => (
            <span key={index} className="option-text">
              {part.text}
            </span>
          ))}
          <div>
            <span className="option-secondary-text">{option.structured_formatting.secondary_text}</span>
          </div>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Autocomplete
        id={id}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        getOptionLabel={getOptionLabel}
        filterOptions={(x) => x}
        onChange={handleChange}
        onInputChange={handleInputChange}
        renderInput={renderInput}
        renderOption={renderOption}
      />
    </>
  );
};
