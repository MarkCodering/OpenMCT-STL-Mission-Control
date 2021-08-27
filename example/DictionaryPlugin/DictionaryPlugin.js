export default function STLTelemetryPlugin() {

        function getSTLRocketDictionary() {
            return fetch('/example/DictionaryPlugin/dictionary.json').then(function (response) {
                return response.json();
            });
        }

        // An object provider builds Domain Objects
        var STLRokcet_ObjectProvider = {
            get: function (identifier) {
                return getSTLRocketDictionary().then(function (dictionary) {
                    //console.log("STL Rocket: identifier.name = " + identifier.key);
                    if (identifier.key === 'STL Rocket') {
                        return {
                            identifier: identifier,
                            name: dictionary.name,
                            type: 'folder',
                            location: 'ROOT'
                        };
                    } else {
                        var measurement = dictionary.measurements.filter(function (m) {
                            return m.key === identifier.key;
                        })[0];
                        return {
                            identifier: identifier,
                            name: measurement.name,
                            type: 'STLRocket.taxonomy',
                            telemetry: {
                                values: measurement.values
                            },
                            location: 'STLRocket.taxonomy:STL Rocket'
                            };
                        }
                });
            }
        };
    

        // The composition of a domain object is the list of objects it contains, as shown (for example) in the tree for browsing.
        // Can be used to populate a hierarchy under a custom root-level object based on the contents of a telemetry dictionary.
        // "appliesTo"  returns a boolean value indicating whether this composition provider applies to the given object
        // "load" returns an array of Identifier objects (like the channels this telemetry stream offers)
        var STLRocket_CompositionProvider = {
            appliesTo: function (domainObject) {
                return domainObject.identifier.namespace === 'STLRocket.taxonomy'
                    && domainObject.type === 'folder';
            },
            load: function (domainObject) {
                return getSTLRocketDictionary()
                    .then(function (dictionary) {
                        return dictionary.measurements.map(function (m) {
                            return {
                                namespace: 'STLRocket.taxonomy',
                                key: m.key
                            };
                        });
                    });
            }
        };

        return function install(openmct) {
            // The addRoot function takes an "object identifier" as an argument
            openmct.objects.addRoot({
                namespace: 'STLRocket.taxonomy',
                key: 'STL Rocket'
            });

            openmct.objects.addProvider('STLRocket.taxonomy', STLRokcet_ObjectProvider);

            openmct.composition.addProvider(STLRocket_CompositionProvider);

            openmct.types.addType('STLRocket.taxonomy', {
                name: 'STL Rocket',
                description: 'Telemetry of STL Rocket',
                cssClass: 'icon-telemetry',
            }); 
    }
    //return STLTelemetryPlugin;
}