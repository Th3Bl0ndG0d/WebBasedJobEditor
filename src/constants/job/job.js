import Cylinder from "../cylinder/cylinder.js";


const Job = (id, number, name, data, info, repeat = 1,cylinders = []) => ({
    id,
    number,
    name,
    data,
    info,
    repeat,
    cylinders, // array van Cylinder-objecten

});

export default Job;