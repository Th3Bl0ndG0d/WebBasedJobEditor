import Job from "../job/job.js";
import Cylinder from "../cylinder/cylinder.js";
import Plate from "../plate/plate.js";

const jobDatabase = [
    Job(1, 'JOB-001', 'Verpakking Design A', 'Flexo Print', 'Klant: Verpakkingen BV', 620, [
        Cylinder(101, 'Cylinder A1', [
            Plate(1001, 300, 400, 380, 10, 10),
            Plate(1002, 320, 420, 390, 15, 20)
        ]),
        Cylinder(102, 'Cylinder A2', [
            Plate(1003, 280, 410, 370, 5, 25)
        ])
    ]),
    Job(2, 'JOB-002', 'Etiketten Serie B', 'Digital Print', 'Etiketten voor flessen', 500, [
        Cylinder(103, 'Cylinder B1', [
            Plate(1004, 310, 405, 385, 20, 30)
        ])
    ]),
    Job(3, 'JOB-003', 'Doosontwerp C', 'Offset Print', 'Bedrukte dozen met logo', 450, [
        Cylinder(104, 'Cylinder C1', [
            Plate(1005, 290, 395, 375, 12, 18),
            Plate(1006, 310, 410, 390, 14, 22)
        ])
    ]),
    Job(4, 'JOB-004', 'Label D', 'Gravure', 'Wijnetiket', 300, [
        Cylinder(105, 'Cylinder D1', [
            Plate(1007, 200, 380, 360, 10, 5)
        ])
    ]),
    Job(5, 'JOB-005', 'Plastic Wrap E', 'Flexo Print', 'Transparante folie', 700, [
        Cylinder(106, 'Cylinder E1', [
            Plate(1008, 280, 410, 390, 13, 8)
        ])
    ]),
    Job(6, 'JOB-006', 'Papieren zak F', 'Digital Print', 'Biologisch afbreekbaar', 200, [
        Cylinder(107, 'Cylinder F1', [
            Plate(1009, 300, 400, 380, 12, 16)
        ])
    ]),
    Job(7, 'JOB-007', 'Krantopmaak G', 'Offset Print', 'Regionale krant', 1200, [
        Cylinder(108, 'Cylinder G1', [
            Plate(1010, 310, 420, 400, 18, 20)
        ])
    ]),
    Job(8, 'JOB-008', 'Zakontwerp H', 'Flexo Print', 'Zak voor diervoer', 520, [
        Cylinder(109, 'Cylinder H1', [
            Plate(1011, 270, 390, 370, 10, 12)
        ])
    ]),
    Job(9, 'JOB-009', 'Etiket I', 'Digital Print', 'Sausfles', 400, [
        Cylinder(110, 'Cylinder I1', [
            Plate(1012, 260, 385, 365, 9, 10)
        ])
    ]),
    Job(10, 'JOB-010', 'Verpakking J', 'Offset Print', 'Vaatwasmiddel', 620, [
        Cylinder(111, 'Cylinder J1', [
            Plate(1013, 300, 410, 390, 16, 14)
        ])
    ]),
    Job(11, 'JOB-011', 'Promo Poster K', 'Digital Print', 'Supermarktposter', 180, [
        Cylinder(112, 'Cylinder K1', [
            Plate(1014, 340, 460, 440, 22, 18)
        ])
    ]),
    Job(12, 'JOB-012', 'Sticker L', 'Flexo Print', 'Tuincentrum', 280, [
        Cylinder(113, 'Cylinder L1', [
            Plate(1015, 250, 370, 355, 10, 11)
        ])
    ]),
    Job(13, 'JOB-013', 'Verzenddoos M', 'Offset Print', 'Webshop dozen', 750, [
        Cylinder(114, 'Cylinder M1', [
            Plate(1016, 330, 440, 420, 20, 25)
        ])
    ]),
    Job(14, 'JOB-014', 'Cadeaupapier N', 'Flexo Print', 'Feestdagen editie', 660, [
        Cylinder(115, 'Cylinder N1', [
            Plate(1017, 360, 470, 450, 30, 35)
        ])
    ]),
    Job(15, 'JOB-015', 'Gebaksdoos O', 'Digital Print', 'Bakkerijverpakking', 340, [
        Cylinder(116, 'Cylinder O1', [
            Plate(1018, 310, 415, 395, 12, 19)
        ])
    ]),
];

export default jobDatabase;
