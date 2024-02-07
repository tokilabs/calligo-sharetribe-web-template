import { bool, shape, string } from 'prop-types';
import {
  isBookingProcess,
  INQUIRY_PROCESS_NAME,
  PURCHASE_PROCESS_NAME,
  resolveLatestProcessName,
  getProcess,
} from '../../transactions/transaction';

import { getStateDataForBookingProcess } from './InboxPage.stateDataBooking';
import { getStateDataForInquiryProcess } from './InboxPage.stateDataInquiry';
import { getStateDataForPurchaseProcess } from './InboxPage.stateDataPurchase';

export const stateDataShape = shape({
  processName: string.isRequired,
  processState: string.isRequired,
  actionNeeded: bool,
  isFinal: bool,
  isSaleNotification: bool,
});

// Translated name of the state of the given transaction
export const getStateData = params => {
  const { transaction } = params;
  const processName = resolveLatestProcessName(transaction?.attributes?.processName);
  const process = getProcess(processName);

  const processInfo = () => {
    const { getState, states } = process;
    const processState = getState(transaction);
    return {
      processName,
      processState,
      states,
    };
  };

  if (processName === PURCHASE_PROCESS_NAME) {
    return getStateDataForPurchaseProcess(params, processInfo());
  } else if (isBookingProcess(processName)) {
    return getStateDataForBookingProcess(params, processInfo());
  } else if (processName === INQUIRY_PROCESS_NAME) {
    return getStateDataForInquiryProcess(params, processInfo());
  } else {
    return {};
  }
};
