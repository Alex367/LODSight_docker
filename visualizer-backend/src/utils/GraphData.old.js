var datatypePrefixes = ["xsd", "rdf"];

export class GraphData {
    constructor(data) {
        this.links = [];
        this.nodes = [];
        this.edges = [];
        this.linkNodes = [];
        this.objectNodes = [];
        this.prefixes = data.pefixes;
        this.idCounter = 0;
        this.labelIndexLimit = 1;
        this.dataset = data.dataset;
        this.endpoint = data.endpoint;
        this.exampleCount = 0;
        this.maxFrequency = data.maxFrequency;
        this.predicates = [];
        this.errors = []

        this.createNodes(data.entities);
        this.createPredicates(data.predicates);
        this.createLinks(data.links);
        this.duplicateDataNodes();
    }

    createNodes(entities) {
        entities.map(item => {
                this.addNode(item.name, item.prefixcc, item.fromCSet);
            }
        )
    }

    addNode(name, prefixcc, fromCSet) {
        let node = new Node(name, prefixcc, this.idCounter++, fromCSet)
        this.nodes.push(node);
        this.objectNodes.push(node);
    }

    createPredicates(predicates) {
        predicates.map(item => {
                this.addPredicate(item.name, item.prefixcc, item.id, item.selected);
            }
        )
    }

    addPredicate(name, prefix, id, selected) {
        let predicate = new Predicate(name, prefix, id, selected)
        this.predicates.push(predicate);
    }

    createLinks(links) {
        links.map(item => {
                if (item.start < 0 || item.start > this.nodes.length || item.end < 0 || item.end > this.nodes.length) {
                    this.setError('error in data on link ' + item.prefix + item.name);
                } else {
                    this.addLink(item.label.name, item.label.prefixcc, this.nodes[item.start], this.nodes[item.end], item.fromCSet, item.frequency);
                }
            }
        )
    }

    addLink(name, prefix, start, end, fromCSet, frequency) {
        let existing = -1;
        this.links.map((item, index) => {
            if (item.source == start.id && item.target == end.id) {
                existing = index;
            } else if (item.source == end.id && item.target == start.id) {
                existing = -2
            }
        })

        if (existing > -1) {
            this.links[existing].addLabel(name, prefix);
            this.links[existing].updateFrequency(frequency);
            if(this.links[existing].getLabelCount() > this.labelIndexLimit){
                this.labelIndexLimit = this.links[existing].getLabelCount();
            }

        } else if (existing == -1) {
            let link = new Link(name, prefix, start, end, this.idCounter++, fromCSet, this, frequency);
            this.links.push(link);
        }
    }

    addLinkNode(name, prefix, fromCSet) {
        var node = new LinkNode(name, prefix, this.idCounter++, fromCSet);
        this.nodes.push(node);
        this.linkNodes.push(node);
        return node;
    }

    addEdge(start, end, fromCSet, frequency) {
        var edge = null;
        if (start.id != end.id) {
            edge = new Edge(start, end, this.idCounter++, fromCSet, frequency);
            this.edges.push(edge);
        }
        return edge;
    }

    duplicateDataNodes(){
        var visitedNodes = [];
        this.links.map((item) => {
            var isDatatype = false;
            for(var i = 0; i < datatypePrefixes.length; i++) {
                if(datatypePrefixes[i] == item.target.prefix){
                    isDatatype = true;
                    break;
                }
            }
            if(isDatatype){
                if(visitedNodes.indexOf(item.target.id) != -1){
                    var nodeCopy = this.addNode(item.target.name, item.target.prefix, item.target.fromCSet);
                    item.changeEnd(nodeCopy);
                }else{
                    visitedNodes.push(item.target.id);
                }
            }
        })
    }

    setError(error) {
        this.errors.push(error);
    }
}

class Node {
    constructor(name, prefix, id, fromCSet) {
        this.name = name;
        this.prefix = prefix;
        this.id = id;
        this.selected = false;
        this.fromCSet = fromCSet;
        this.examples = [];
    }
}

class Predicate {
    constructor(name, prefix, id, selected) {
        this.name = name;
        this.prefix = prefix;
        this.id = id;
        this.selected = selected;
    }
}

class LinkNode {
    constructor(name, prefix, id, fromCSet) {
        this.name = "";
        this.prefix = "";
        this.id = id;
        this.selected = false;
        this.fromCSet = fromCSet;
        this.examples = [];
        this.labels = [];
        this.addLabel(name, prefix);
        this.selectedLabelIndex = -1;
    }

    addLabel(name, prefix) {
        let label = {
            name: name,
            prefix: prefix,
            id: -1,
            selected: false
        }
        this.labels.push(label);
        this.updateFrequentPrefix();
    }

    updateFrequentPrefix() {
        var prefixes = {};
        for (var i = 0; i < this.labels.length; i++) {
            if (this.labels[i].prefix in prefixes) prefixes[this.labels[i].prefix] += 1;
            else prefixes[this.labels[i].prefix] = 1;
        }
        var freqPrefix = "";
        var maxFreq = 0;
        for (var prefix in prefixes) {
            if (prefixes[prefix] > maxFreq) {
                freqPrefix = prefix;
                maxFreq = prefixes[prefix];
            }
        }
        this.prefix = freqPrefix;
    }
}

class Edge {
    constructor(start, end, id, fromCSet, frequency) {
        this.start = start;
        this.end = end;
        this.source_ = start;
        this.source = start.id;
        this.target_ = end;
        this.target = end.id;
        this.right = true;
        this.left = false;
        this.id = id;
        this.fromCSet = fromCSet;
        this.frequency = frequency;
    }

    setEnd(end) {
        this.end = end;
        this.target = end;
    }
}

class Link {
    constructor(name, prefix, start, end, id, fromCSet, model, frequency) {
        this.name = "";
        this.id = id;
        this.fromCSet = fromCSet;
        this.source_ = start;
        this.source = start.id;
        this.target_ = end;
        this.target = end.id;
        this.frequency = frequency;
        this.node = model.addLinkNode(name, prefix, fromCSet);

        this.startEdge = model.addEdge(start, this.node, fromCSet, frequency);
        this.endEdge = model.addEdge(this.node, end, fromCSet, frequency);
    }

    addLabel(name, prefix) {
        this.node.addLabel(name, prefix);
    }

    updateFrequency(frequency) {
        if (this.frequency < frequency) {
            this.frequency = frequency;
            this.startEdge.frequency = frequency;
            this.endEdge.frequency = frequency;
        }
    }

    getLabelCount(){
        return this.node.labels.length;
    }

    changeEnd(newEnd){
        this.end = newEnd;
        this.endEdge.setEnd(newEnd);
    }
}