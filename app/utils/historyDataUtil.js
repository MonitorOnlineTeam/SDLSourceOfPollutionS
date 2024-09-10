import { SentencedToEmpty } from ".";

export const getShowIndex = params => {
    if (SentencedToEmpty(params, ['sourceType'], '') == "OverWarning") {
        return 3;
    } else {
        if (SentencedToEmpty(params, ['DataType'], '') == 'DayData') {
            return 1
        } else {
            return 0;
        }
    }
};