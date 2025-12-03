export type AddressElement = {
  types: string[];
  longName: string;
  shortName: string;
  code: string;
};

export type AddressItem = {
  roadAddress: string;
  jibunAddress: string;
  englishAddress: string;
  addressElements: AddressElement[];
  x: string;
  y: string;
  distance: number;
};

export type GeoApiResponse = {
  status: string;
  meta: {
    totalCount: number;
    page: number;
    count: number;
  };
  addresses: AddressItem[];
  errorMessage?: string;
};

// 일부 응답은 { Response: GeoApiResponse } 형태로 래핑되는 경우도 있어 이를 허용
export type GeoApiResponseWrapper =
  | GeoApiResponse
  | { Response: GeoApiResponse };

export type GeoLocationResult = {
  roadAddress: string;
  latitude: number;
  longitude: number;
  displayName: string;
} | null;
