
export interface FormData {
  docRef: string;
  date: string;
  dateOfOccurrence: string;
  timeInfoReceived: string;
  timeArrival: string;
  timeActionStarted: string;
  timeDeparture: string;
  description: string;
  cause: string;
  propertyLoss: string;
  propertySaved: string;
  // Media
  deptWater: boolean;
  deptFoam: boolean;
  deptDcp: boolean;
  deptCo2: boolean;
  secWater: boolean;
  secFoam: boolean;
  secDcp: boolean;
  secCo2: boolean;
  // Satisfaction
  satisfactionIndex: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Excellent' | '';
  // Party
  partyName: string;
  partyDesignation: string;
  partyPhone: string;
  // Footer
  vehicleNo: string;
  fireFightingInCharge: string;
  crew1: string;
  crew2: string;
  crew3: string;
  crew4: string;
}

export const INITIAL_FORM_DATA: FormData = {
  docRef: 'TGS/SEC/03',
  date: new Date().toISOString().split('T')[0],
  dateOfOccurrence: '',
  timeInfoReceived: '',
  timeArrival: '',
  timeActionStarted: '',
  timeDeparture: '',
  description: '',
  cause: '',
  propertyLoss: '',
  propertySaved: '',
  deptWater: false, deptFoam: false, deptDcp: false, deptCo2: false,
  secWater: false, secFoam: false, secDcp: false, secCo2: false,
  satisfactionIndex: '',
  partyName: '',
  partyDesignation: '',
  partyPhone: '',
  vehicleNo: '',
  fireFightingInCharge: '',
  crew1: '', crew2: '', crew3: '', crew4: ''
};
