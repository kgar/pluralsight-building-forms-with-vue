import { ref } from "vue";

export default class AddressModel {
  address1 = ref("");
  address2 = ref("");
  cityTown = ref("");
  stateProvince = ref("");
  postalCode = ref("");

  clear() {
    this.address1 = "";
    this.address2 = "";
    this.cityTown = "";
    this.stateProvince = "";
    this.postalCode = "";
  }
}
