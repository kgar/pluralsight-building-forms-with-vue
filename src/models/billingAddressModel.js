import { ref } from "vue";
import AddressModel from "./addressModel";

export default class BillingAddressModel extends AddressModel {
  sameAsShipping = ref(false);
}
