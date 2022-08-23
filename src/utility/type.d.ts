export declare type current = {
  year: number;
  month: number;
  startDateObj?: Date;
  endDateObj?: Date;
};

export declare type attraction = {
  Address: string;
  City: string;
  Class1: string;
  Description: string;
  DescriptionDetail: string;
  OpenTime: string;
  ParkingPosition: { PositionLon?: number; PositionLat?: number; GeoHash?: string };
  Phone: string;
  Picture: { PictureUrl1: string; PictureDescription1: string };
  Position: { PositionLon: number; PositionLat: number; GeoHash: string };
  ScenicSpotID: string;
  ScenicSpotName: string;
  SrcUpdateTime: string;
  UpdateTime: string;
  ZipCode: string;
};

export declare type activity = {
  ActivityID: string;
  ActivityName: string;
  Address?: string;
  Phone?: string;
  City: string;
  Class1?: string;
  Class2?: string;
  Cycle?: string;
  Description: string;
  EndTime: string;
  Location: string;
  Organizer: string;
  Picture: { [key: string]: string };
  Position: {
    GeoHash: string;
    PositionLat: number;
    PositionLon: number;
  };
  SrcUpdateTime: string;
  StartTime: string;
  UpdateTime: string;
};
