import { ref } from "vue";
import AddressModel from "./addressModel";

export default class ShippingAddressModel extends AddressModel {
    fullName = ref("");
    company = ref("");
}