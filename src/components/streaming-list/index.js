import { h, Component } from 'preact';
import { skip, take, toArray, Buffer } from '../../utils/iteration-utils';

const STYLE_INNER = 'position: relative;overflow-y: scroll;height: 100%';
const STYLE_CONTENT = 'position: absolute;left: 0;width: 100%';

export default class StreamingList extends Component {

    startPage;
    finishPage;
    itemsPerTile;
    tileHeight;
    buffer;

    state = {
        items: [],
    }

    /**
     * Handles callbacks from scroll and resize events, we throttle these high frequency
     * events via animation frame callbacks; we enqueue work to update the visible range.
     */
    handleScrollOrResize = () => requestAnimationFrame(this.updateVisibleRange);

    /**
     * Handles renderable frequency callbacks from high frequency source updates and
     * establishes the visible range of items that should be rendered; it does not
     * update the actual items to be rendered as these require asynchronous work, as
     * such we end by updating state and await a component state update pass, if the
     * state change is significant (i.e., it would change the items being rendered)
     * then we trigger async work to build this item list via shouldComponentUpdate.
     */
    updateVisibleRange = () => {

        const { itemHeight, itemGutter, pageSizer } = this.props;

        function getHeightForCount(count) {

            if (count === 0) return 0;

            const itemsHeight = count * itemHeight;
            const gutters = (count - 1) * itemGutter;

            return itemsHeight + gutters;

        }

        const height = this.base.offsetHeight;
        const y1 = this.base.firstElementChild.scrollTop;

        const visibleItems = Math.ceil(height / (itemHeight + itemGutter));
        const itemsPerTile = pageSizer(visibleItems);
        const tileHeight = getHeightForCount(itemsPerTile);

        const y2 = y1 + height;

        // calculate the tile page numbers that match the top and bottom points
        const startPage = Math.floor(y1 / tileHeight);
        const finishPage = Math.floor(y2 / tileHeight);

        const hasPendingChanges =
            this.startPage !== startPage ||
            this.finishPage !== finishPage ||
            this.itemsPerTile !== itemsPerTile ||
            this.tileHeight !== tileHeight;

        this.startPage = startPage;
        this.finishPage = finishPage;
        this.itemsPerTile = itemsPerTile;
        this.tileHeight = tileHeight;

        // we need to rebuild tiles only if the buffer, tile range or tile size has changed
        // if we have pending changes then trigger a tile rebuild; this should only
        // happen when resizing, updating tile size, tile factor or when scrolling
        // over a tile boundary
        if (hasPendingChanges) {
            this.updateTiles();
        }

    }

    /**
     * Handles triggering a tile update if significant changes have occured to the
     * visible items, if the current state items do not match the incoming state items
     * then the component should update, otherwise it should not; however if changes
     * to the visible range has occurred then async work is started via updateTiles
     */
    shouldComponentUpdate(_, { items }) {
        return this.state.items !== items;
    }

    /**
     * Handles building an array of visible items from source data and a given
     * starting and finishing page; we do this by lazily iterating over the
     * async data source, first skipping n amount of items we don't need,
     * taking the next n items we do need and then finally building an array
     * of items from this subset
     */
    async updateTiles() {

        const { buffer, startPage, finishPage, itemsPerTile } = this;

        const start = startPage * itemsPerTile;
        const count = (Math.max(finishPage - startPage, 1) * itemsPerTile) + itemsPerTile;

        const items = await toArray(take(skip(buffer, start), count));

        this.setState({ items });

    }

    /**
     * When our component mounts we want to begin listening to scrolling and resize
     * events so that we can update our subset of visible items when needed. We also
     * create a buffer from the current data source; a buffer is important when
     * iterating our data source as we will need to iterate multiple times as we move
     * around the virtual set of items, the buffer facilitates this by recording
     * all items that it sees being iterated from a given source iterable and then
     * re-iterating them for subsequent iterations
     */
    componentDidMount() {

        const scrollingContainer = this.base.querySelector('[data-scrolling-container]');
        const window = this.base.ownerDocument.defaultView;

        scrollingContainer.addEventListener('scroll', this.handleScrollOrResize, { passive: true });
        window.addEventListener('resize', this.handleScrollOrResize, { passive: true });

        this.buffer = new Buffer(this.props.source);

        this.handleScrollOrResize(); // todo: review the name of this method

    }

    componentWillReceiveProps({ source }) {

        if (source === this.props.source) return;

        this.buffer = new Buffer(source);

        this.updateTiles();

    }

    componentWillUnmount() {

        const scrollingContainer = this.base.querySelector('[data-scrolling-container]');
        const window = this.base.ownerDocument.defaultView;

        scrollingContainer.removeEventListener('scroll', this.handleScrollOrResize);
        window.removeEventListener('resize', this.handleScrollOrResize);

    }

    // devnote, we bring our known props into scope so they are excluded
    // for 'props', which we then bind to our top level container

    // eslint-disable-next-line no-unused-vars
    render({ source, total, overscan, itemTemplate, itemHeight, itemGutter, ...props }, { items }) {

        const { buffer, startPage, itemsPerTile, tileHeight } = this;

        const offset = startPage * tileHeight;
        const maximumHeight = buffer == null ? 0 : buffer.pending.length * itemHeight;

        const startIndex = startPage * itemsPerTile;

        return (
            <div {...props}>
                <div data-scrolling-container style={`${STYLE_INNER}`}>
                    <div style={`${STYLE_CONTENT};transform: translateY(${offset}px);min-height: ${maximumHeight - offset}px`}>
                        {items.map((item, i) => (
                            <div key={startIndex + i} style={`height: ${itemHeight}px;margin-top: ${itemGutter}px`}>
                                {itemTemplate(item, startIndex + i)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
