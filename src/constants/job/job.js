import Cylinder from "../cylinder/cylinder.js";


const Job = (id, number, name, date, info, repeat = 1, cylinders = []) => ({
    id,
    number,
    name,
    data: date,
    info,
    repeat,
    cylinders, // array van Cylinder-objecten

});

export default Job;