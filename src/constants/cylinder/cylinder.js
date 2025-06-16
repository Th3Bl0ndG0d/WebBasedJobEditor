import Plate from "../plate/plate.js";

const Cylinder = (id, name, plates = []) => ({
    id,
    name,
    plates, // array van Plate-objecten
});

export default Cylinder;