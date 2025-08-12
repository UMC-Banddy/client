export interface BandDetail {
  bandId: number;
  bandName: string;
  profileImageUrl: string;
  ageRange: string;
  genderCondition: string;
  region: string;
  district: string;
  description: string;
  endDate: string;
  snsList: [
    {
      platform: string;
      snsLink: string;
    },
    {
      platform: string;
      snsLink: string;
    },
    {
      platform: string;
      snsLink: string;
    }
  ];
}
