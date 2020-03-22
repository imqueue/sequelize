/*!
 * @imqueue/sequelize - Sequelize ORM refines for @imqueue
 *
 * Copyright (c) 2019, imqueue.com <support@imqueue.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 * OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
/**
 * Graph internal storage data type
 *
 * @type {Map<any, any>}
 */
export type GraphMap<T> = Map<T, T[]>;

/**
 * Callback type used on graph traversal iterations steps. It will obtain
 * vertex as a first argument - is a vertex on iteration visit, and a map
 * of visited vertices as a second argument.
 * If this callback returns false value it will break iteration cycle.
 *
 * @type {(vertex: T, visited: Map<T, boolean>): false | void}
 */
export type GraphForeachCallback<T> = (
    vertex: T,
    visited: Map<T, boolean>
) => false | void;

/**
 * Class Graph
 * Simple undirected, unweighted graph data structure implementation
 * with DFS (depth-first search traversal implementation)
 */
export class Graph<T> {
    /**
     * Internal graph data storage
     *
     * @access private
     * @type {GraphMap<any>}
     */
    private list: GraphMap<T> = new Map<T, T[]>();

    /**
     * Adds vertices to graph
     *
     * @param {...any[]} vertex - vertices to add
     * @return {Graph<any>}
     */
    public addVertex(...vertex: T[]): Graph<T> {
        for (const v of vertex) {
            this.list.set(v, []);
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes vertices from a graph with all their edges
     *
     * @param {...any[]} vertex
     * @return {Graph<any>}
     */
    public delVertex(...vertex: T[]): Graph<T> {
        for (const v of vertex) {
            this.list.delete(v);
        }

        return this;
    }

    /**
     * Adds an edges to a given vertex
     *
     * @param {any} fromVertex
     * @param {...any[]} toVertex
     * @return {Graph<any>}
     */
    public addEdge(fromVertex: T, ...toVertex: T[]): Graph<T> {
        let edges = this.list.get(fromVertex);

        if (!edges) {
            this.addVertex(fromVertex);
            edges = this.list.get(fromVertex) as T[];
        }

        edges.push(...toVertex);

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes given edges from a given vertex
     *
     * @param {any} fromVertex - target vertex to remove edges from
     * @param {...any[]} toVertex - edges to remove
     * @return {Graph<any>}
     */
    public delEdge(fromVertex: T, ...toVertex: T[]): Graph<T> {
        const edges = this.list.get(fromVertex);

        if (!(edges && edges.length)) {
            return this;
        }

        for (const vertex of toVertex) {
            while (~edges.indexOf(vertex)) {
                edges.splice(edges.indexOf(vertex), 1);
            }
        }

        return this;
    }

    /**
     * Checks if a given vertex has given edge, returns true if has, false -
     * otherwise
     *
     * @param {any} vertex
     * @param {any} edge
     * @return {boolean}
     */
    public hasEdge(vertex: T, edge: T): boolean {
        return !!~(this.list.get(vertex) || []).indexOf(edge);
    }

    /**
     * Checks if this graph contains given vertex, returns true if contains,
     * false - otherwise
     *
     * @param {any} vertex
     * @return {boolean}
     */
    public hasVertex(vertex: T): boolean {
        return this.list.has(vertex);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Performs DFS traversal over graph, executing on each step passed callback
     * function. If callback returns false - will stop traversal at that
     * step.
     *
     * @param {GraphForeachCallback<any>} callback
     * @return {Graph<any>}
     */
    public forEach(callback: GraphForeachCallback<T>): Graph<T> {
        const visited = new Map<T, boolean>();

        for (const node of this.list.keys()) {
            this.walk(node, callback, visited);
        }

        return this;
    }

    /**
     * Performs DFS walk over graph staring from given vertex, unless
     * graph path is end for that vertex. So, literally, it performs
     * walking through a possible path down the staring vertex in a graph.
     *
     * @param {any} vertex
     * @param {GraphForeachCallback<any>} callback
     * @param {Map<any, boolean>()} visited
     * @return {Graph<any>}
     */
    public walk(
        vertex: T,
        callback?: GraphForeachCallback<T>,
        visited = new Map<T, boolean>(),
    ): Graph<T> {
        if (!visited.get(vertex)){
            visited.set(vertex, true);

            if (callback && callback(vertex, visited) === false) {
                return this;
            }

            for (const neighbor of this.list.get(vertex) || []) {
                this.walk(neighbor, callback, visited);
            }
        }

        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns max possible path down the graph for a given vertex,
     * using DFS traversal over the path
     *
     * @param {any} vertex
     * @return {IterableIterator<any>}
     */
    public path(vertex: T): IterableIterator<T> {
        const visited = new Map<T, boolean>();

        this.walk(vertex, undefined, visited);

        return visited.keys();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns true if graph has al least one cycled path in it,
     * false - otherwise
     *
     * @return {boolean}
     */
    public isCycled(): boolean {
        const visited = new Map<T, boolean>();
        const stack = new Map<T, boolean>();

        for (const node of this.list.keys()) {
            if (this.detectCycle(node, visited, stack)) {
                return true;
            }
        }

        return false;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns list of vertices in this graph
     *
     * @return {IterableIterator<any>}
     */
    public vertices(): IterableIterator<T> {
        return this.list.keys();
    }

    /**
     * Performs recursive cycles detection on a graph.
     * Private method. If you need to detect cycles, use isCycled() instead.
     *
     * @access private
     * @param {any} vertex
     * @param {Map<any, boolean>} visited
     * @param {Map<any, boolean>} stack
     */
    private detectCycle(
        vertex: T,
        visited: Map<T, boolean>,
        stack: Map<T, boolean>,
    ): boolean {
        if (!visited.get(vertex)) {
            visited.set(vertex, true);
            stack.set(vertex, true);

            for (const currentNode of this.list.get(vertex) || []) {
                if ((!visited.get(currentNode) && this.detectCycle(
                    currentNode, visited, stack,
                )) || stack.get(currentNode)) {
                    return true;
                }
            }
        }

        stack.set(vertex, false);

        return false;
    }
}
