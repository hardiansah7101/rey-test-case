import { Dimensions, PixelRatio } from "react-native";
import { heightPercentageToDP, widthPercentageToDP } from "react-native-responsive-screen";

export const DimHeight = Dimensions.get("window").height;
export const DimWidth = Dimensions.get("window").width;

export const hp = heightPercentageToDP;
export const wp = widthPercentageToDP;
export const pxRatio = PixelRatio.getPixelSizeForLayoutSize