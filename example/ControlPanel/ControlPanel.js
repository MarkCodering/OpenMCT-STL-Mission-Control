export default function ControlPanel() {
    return function(openmct){
        console.log("ControlPanel");

        openmct.types.addType('STLRocket.taxonomy', {
            name: 'STL Rocket Control Panel',
            description: 'Control Panel of STL Rocket',
            cssClass: 'icon-telemetry',
        }); 
    }
}