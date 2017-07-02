import { h, Component } from 'preact';
import { skip, take, toArray, Buffer } from '../../utils/iteration-utils';

const STYLE_INNER = 'position: relative;overflow-y: scroll;height: 100%';
const STYLE_CONTENT = 'position: absolute;left: 0;width: 100%';

function getHeightForCount(itemHeight, itemGutter, count) {

    if (count === 0) return 0;

    return count * (itemHeight + itemGutter);

}

export default class StreamingList extends Component {

    state = {
        items: [],
        skipCount: 0,
    }

    /**
     * Handles callbacks from scroll and resize events, we throttle these high frequency
     * events via animation frame callbacks; we enqueue work to update the visible range.
     */
    handleResize = () => requestAnimationFrame(this.updateVisibleRange);
    handleScroll = () => requestAnimationFrame(this.handleResizeInvalidated);

    handleResizeInvalidated = () => {
        const position = this.base.firstElementChild.scrollTop;
        this.props.onPositionChange({ position });
    }

    /**
     * Handles renderable frequency callbacks from high frequency source updates and
     * establishes the visible range of items that should be rendered; it does not
     * update the actual items to be rendered as these require asynchronous work, as
     * such we end by updating state and await a component state update pass, if the
     * state change is significant (i.e., it would change the items being rendered)
     * then we trigger async work to build this item list via shouldComponentUpdate.
     */
    updateVisibleRange = async isSourceUpdating => {

        const { itemHeight, itemGutter, position = 0 } = this.props;

        const height = this.base.offsetHeight;
        const itemSize = itemHeight + itemGutter;

        const overscan = height * 2;
        const y1overscan = Math.max(position - height, 0);

        const skipCount = Math.floor(y1overscan / itemSize);
        const takeCount = Math.ceil((height + (overscan * 2)) / itemSize);

        const hasPendingChanges =
            this.state.skipCount !== skipCount ||
            this.state.takeCount !== takeCount ||
            this.state.height !== height;

        if (isSourceUpdating || hasPendingChanges) {

            const items = await toArray(take(skip(this.state.buffer, skipCount), takeCount));

            this.setState({ items, skipCount, takeCount, height });

        }

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
    async componentDidMount() {

        const scrollingContainer = this.base.querySelector('[data-scrolling-container]');
        const window = this.base.ownerDocument.defaultView;

        scrollingContainer.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize, { passive: true });

        const buffer = new Buffer(this.props.source);
        this.setState({ buffer });

        await this.updateVisibleRange();

        this.forceUpdate(() => {
            this.base.firstElementChild.scrollTop = this.props.position;
        });

    }

    componentWillReceiveProps({ source, position }) {

        const isSourceUpdating = source !== this.props.source;

        if (!isSourceUpdating && position === this.props.position) return;

        if (isSourceUpdating) {
            const buffer = new Buffer(this.props.source);
            this.setState({ buffer });
        }

        this.updateVisibleRange(isSourceUpdating);

    }

    /**
     * Handles triggering a tile update if significant changes have occured to the
     * visible items, if the current state items do not match the incoming state items
     * then the component should update, otherwise it should not; however if changes
     * to the visible range has occurred then async work is started via updateTiles
     */
    shouldComponentUpdate = ({ itemTemplate }, { items }) =>
        this.props.itemTemplate !== itemTemplate ||
        this.state.items !== items;

    componentWillUnmount() {

        const scrollingContainer = this.base.querySelector('[data-scrolling-container]');
        const window = this.base.ownerDocument.defaultView;

        scrollingContainer.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);

    }

    // devnote, we bring our known props into scope so they are excluded
    // for 'props', which we then bind to our top level container
    // eslint-disable-next-line no-unused-vars
    render({ source, position, total, itemTemplate, itemHeight, itemGutter, ...props }, { buffer, items, skipCount, takeCount }) {

        const offset = getHeightForCount(itemHeight, itemGutter, skipCount);
        const maximumHeight =  getHeightForCount(itemHeight, itemGutter, buffer ? Math.min(buffer.pending.length, total) : 0);

        return (
            <div {...props}>
                <div data-scrolling-container={''} style={`${STYLE_INNER}`}>
                    <div style={`${STYLE_CONTENT};height: ${maximumHeight + itemGutter}px`}>
                        <div style={`height: ${offset}px`} />
                        {items.map((item, i) => (
                            <div key={skipCount + i} style={`height: ${itemHeight}px;margin-top: ${itemGutter}px`}>
                                {itemTemplate(item)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}
