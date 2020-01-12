var datatypePrefixes = ["xsd", "rdf"];

class Config {
    constructor(opts, colors) {
        this.opts = {
            showPrefix: false,
            selectedNode: null
            //filterPredicates: [{prefix: 'ontolex',  name: 'lexicalForm'}],
            // filterPefixes: [],
        }
        this.colors = colors;
        this.opts = Object.assign(this.opts, opts);
        this.getProperty = this.getProperty;
        this.getColor = this.getColor;
    }

    getProperty(property) {
        return this.opts[property];
    }

    getColor(prefix, opacity = 1) {
        var color = this.colors[prefix];
        if (!color) {
            return 'hsla(0, 0%, 50%, ' + opacity + ')';
        }
        return 'hsla(' + color.hue + ', ' + color.saturation + '%, ' + color.lightness + '%, ' + opacity + ')';
    }
}

export class GraphData {
    constructor(data, config, colors) {
        var config = new Config(config, colors);

        this.links = [];
        this.nodes = [];
        //this.prefixes = data.pefixes;
        //this.predicates = data.predicates;
        this.idCounter = 0;
        this.labelIndexLimit = 1;
        this.errors = [];
        this.curvatureConstant = 0.25;

        this.createNodes(data.entities, config);
        this.createLinks(data.links, config);
        this.duplicateDataNodes();
        this.filterSearch(config);
        this.colorize(config);
    }

    createNodes(entities, config) {
        entities.map(item => {
                this.addNode(item.name, item.prefix, config);
            }
        )
    }

    addNode(name, prefix, config) {
        let node = new Node(name, prefix, this.idCounter++, config)
        this.nodes.push(node);
    }

    createLinks(links, config) {
        //  let predicates = config.getProperty('filterPredicates');
        links.map(item => {
                if (item.start < 0 || item.start > this.nodes.length || item.end < 0 || item.end > this.nodes.length) {
                    this.setError('error in data on link ' + item.label.prefix + " - " + item.label.name);
                } else {
                    // if(predicates.length == 0){
                    //direct search of link -> add nodes to search results
                    this.addLink(item.label.name, item.label.prefix, item.start, item.end, item.frequency, config);

                    //}else{
                    //    predicates.map(predicate => {
                    //      if(predicate.prefix == item.label.prefix && predicate.name == item.label.name){
                    //          this.addLink(item.label.name, item.label.prefix, this.nodes[item.start], this.nodes[item.end], item.frequency, config);
                    //     }
                    //  })
                    //}
                }
            }
        )

    }

    addLink(name, prefix, start_, end_, frequency, config) {
        let groupedLinks = config.getProperty('groupedLinks');
        let existing = -1;
        let addLink = true;
        let curvature = 0;
        let start = this.nodes[start_];
        let end = this.nodes[end_];
        this.links.map((item, index) => {
            if (item.source == start.id && item.target == end.id) {
                existing = index;
            }else if(item.source == end.id && item.target == start.id){
                existing = -2
                addLink = false
            }
        })

        if (existing > -1) {
            if(groupedLinks){
                this.links[existing].addLabel(name, prefix, config);
                this.links[existing].updateFrequency(frequency);
                addLink = false;
                //if (this.links[existing].getLabelCount() > this.labelIndexLimit) {
                //    this.labelIndexLimit = this.links[existing].getLabelCount();
                //}
            }else{
                let lastCurvature = this.links[existing].curvature;
                if(lastCurvature == 0){
                    curvature = this.curvatureConstant;
                }else if(lastCurvature > 0){
                    curvature = - lastCurvature;
                }else{
                    curvature = -lastCurvature + this.curvatureConstant;
                }
            }
        }
        if (addLink) {
            var start_obj = {
                start: start,
                index: start_
            }
            var end_obj = {
                end: end,
                index: end_
            }
            let link = new Link(name, prefix, start_obj, end_obj, this.idCounter++, frequency, curvature, config);
            this.links.push(link);
        }
    }

    duplicateDataNodes() {
        var visitedNodes = [];
        this.links.map((item) => {
            var isDatatype = false;
            for (var i = 0; i < datatypePrefixes.length; i++) {
                if (datatypePrefixes[i] == item.target.prefix) {
                    isDatatype = true;
                    break;
                }
            }
            if (isDatatype) {
                if (visitedNodes.indexOf(item.target.id) != -1) {
                    var nodeCopy = this.addNode(item.target.name, item.target.prefix);
                    item.changeEnd(nodeCopy);
                } else {
                    visitedNodes.push(item.target.id);
                }
            }
        })
    }

    setError(error) {
        this.errors.push(error);
    }

    filterSearch(config) {
        var search = config.getProperty('search');
        if (!search) return;
        var links = {};
        var nodes = {};
        this.nodes.map((item) => {
                if (item.searched) {
                    nodes[item.id] = item
                }
            }
        )
        this.links.map((item) => {
                if (item.searched) {
                    links[item.id] = item
                    nodes[this.nodes[item.source_index].id] = this.nodes[item.source_index]
                    nodes[this.nodes[item.target_index].id] = this.nodes[item.target_index]
                }
                if(this.nodes[item.source_index].searched || this.nodes[item.target_index].searched){
                    links[item.id] = item
                    nodes[this.nodes[item.source_index].id] = this.nodes[item.source_index]
                    nodes[this.nodes[item.target_index].id] = this.nodes[item.target_index]
                }
            }
        )
        this.links = Object.values(links);
        this.nodes = Object.values(nodes);
    }

    colorize(config) {
        var selectedNode = config.getProperty('selectedNode');

        if (selectedNode == null) return;
        var nodes = [];
        this.links.map((item) => {
                if (item.source == selectedNode || item.target == selectedNode) {
                    if (nodes.indexOf(item.source) == -1) {
                        nodes.push(item.source)
                    }
                    if (nodes.indexOf(item.target) == -1) {
                        nodes.push(item.target)
                    }
                }
            }
        )

        if (nodes.length > 0) {
            this.nodes.map((item) => {
                if (nodes.indexOf(item.id) > -1) {
                    item.setColor(config, item.prefix, 1);
                }
            })

            this.links.map((item) => {
                    if (nodes.indexOf(item.source) > -1 && nodes.indexOf(item.target) > -1) {
                        item.setColor(0.15);
                        item.setLabelColor(config, item.prefix, 1);
                    }
                }
            )
        }
    }
}

class Node {
    constructor(name, prefix, id, config) {
        this.name = name;
        this.prefix = prefix;
        this.id = id;
        this.showPrefix = config.getProperty('showPrefix');
        var search = config.getProperty('search');
        this.searched = search && name.toLowerCase().search(search) > -1;

        if (config.getProperty('selectedNode') == null) {
            this.setColor(config, prefix, 1);
        } else {
            this.setColor(config, prefix, .1);
        }
    }

    setColor(config, prefix, opacity) {
        this.color = config.getColor(prefix, opacity);
    }
}

class Link {
    constructor(name, prefix, start, end, id, frequency, curvature, config) {
        this.id = id;
        this.source = start.start.id;
        this.target = end.end.id;
        this.source_index = start.index;
        this.target_index = end.index;
        this.frequency = frequency;
        this.curvature = curvature;
        this.label = config.getProperty('showPrefix') ? (prefix + ":" + name) : name;
        this.labels = config.getProperty('showPrefix') ? [prefix + ":" + name] : [name];
        this.prefix = prefix;
        var search = config.getProperty('search');
        //direct search or one of its nodes is searched
        this.searched = (search && name.toLowerCase().search(search) > -1) || start.start.searched || end.end.searched;

        if (config.getProperty('selectedNode') == null) {
            if (config.getProperty('is3D')) {
                this.color = "hsla(0, 0%, 0%, 1)";
            } else {
                this.color = "hsla(0, 0%, 0%, .15)";
            }
            this.setLabelColor(config, prefix, 1);
        } else {
            if (config.getProperty('is3D')) {
                this.color = "hsla(0, 0%, 0%, .7)";
            } else {
                this.color = "hsla(0, 0%, 0%, .05)";
            }
            this.setLabelColor(config, prefix, .1);
        }
    }

    setColor(opacity) {
        this.color = "hsla(0, 0%, 0%, " + opacity + ")";
    }

    setLabelColor(config, prefix, opacity) {
        this.labelColor = config.getColor(prefix, opacity);
    }

    addLabel(name, prefix, config) {
        let len = this.labels.length;
        if (config.getProperty('showPrefix')) {
            this.label += "<br>" + prefix + ":" + name;
        } else {
            this.label += "<br>" + name;
        }
        if (len == 1) {
            this.labels.push("...");
        }
    }

    updateFrequency(frequency) {
        if (this.frequency < frequency) {
            this.frequency = frequency;
        }
    }

    getLabelCount() {
        return this.label.split("<br>").length;
    }

    changeEnd(newEnd) {
        this.target = newEnd.id;
    }
}