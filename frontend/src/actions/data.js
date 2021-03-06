// import Promise from 'bluebird';
import NProgress from 'nprogress';
import { parseNearAmount } from 'near-api-js/lib/utils/format';
import { ACTION_TYPE_UPDATE_DATA } from 'config';
import near from 'utils/wallet';
import { parseBusiness, parseBusinesses } from 'utils/data';
import { CONTRACT_NAME } from 'config/wallet';

export function updateData(payload) {
  return {
    type: ACTION_TYPE_UPDATE_DATA,
    payload,
  };
}

export function registerBusiness(fields) {
  return async (dispatch, getState) => {
    NProgress.start();
    NProgress.set(0.4);
    const { contract } = near();
    try {
      await contract.register_business(fields);
      dispatch(
        updateData({
          businesses: parseBusinesses(await contract.get_businesses()),
        })
      );
    } finally {
      NProgress.done();
    }
  };
}

export function donate(businessId, donation) {
  return async (dispatch, getState) => {
    NProgress.start();
    NProgress.set(0.4);
    const { wallet } = near();
    try {
      await wallet.account().functionCall(
        CONTRACT_NAME,
        'donate',
        { business_id: parseInt(businessId) },
        null, // use default gas
        parseNearAmount(donation.toString())
      );
    } finally {
      NProgress.done();
    }
  };
}

export function fetchBusiness(businessId) {
  return async (dispatch, getState) => {
    NProgress.start();
    NProgress.set(0.4);
    try {
      const { contract } = near();
      const {
        data: { businesses },
      } = getState();
      const b = await contract.get_business({
        business_id: businessId,
      });
      b.id = businessId;
      businesses[businessId] = parseBusiness(b);
      dispatch(
        updateData({
          businesses,
        })
      );
    } finally {
      NProgress.done();
    }
  };
}
