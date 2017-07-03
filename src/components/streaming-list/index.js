import { h, Component } from 'preact';
import { skip, take, toArray, Buffer } from '../../utils/iteration-utils';

const STYLE_INNER = 'position: relative;overflow-y: scroll;height: 100%';
const STYLE_CONTENT = 'position: absolute;left: 0;width: 100%';

const getHeightForCount = (itemHeight, itemGutter, count) => count * (itemHeight + itemGutter);

export default class StreamingList extends Component {

    state = {
        items: [],
        skipCount: 0,
    }

    /**
     * Handles callbacks from scroll and resize events, we throttle these high frequency
     * events via animation frame callbacks; we enqueue work to update the visible range.
     */
    handleResize = () => requestAnimationFrame(this.handleResizeInvalidated);
    handleScroll = () => requestAnimationFrame(this.handleScrollInvalidated);

    handleResizeInvalidated = () => {
        const height = this.base.offsetHeight;
        this.setState({ height });
    }

    handleScrollInvalidated = () => {
        const position = this.base.scrollTop;
        this.props.onPositionChange(position);
    }

    /**
     * Handles renderable frequency callbacks from high frequency source updates and
     * establishes the visible range of items that should be rendered; it does not
     * update the actual items to be rendered as these require asynchronous work, as
     * such we end by updating state and await a component state update pass, if the
     * state change is significant (i.e., it would change the items being rendered)
     * then we trigger async work to build this item list via shouldComponentUpdate.
     */
    updateVisibleRange = async ({ buffer, position = 0, height, itemHeight, itemGutter }) => {

        const itemSize = itemHeight + itemGutter;

        const overscan = height * 2;
        const y1overscan = Math.max(position - height, 0);

        const skipCount = Math.floor(y1overscan / itemSize);
        const takeCount = Math.ceil((height + (overscan * 2)) / itemSize);

        const hasPendingChanges =
            this.state.skipCount !== skipCount ||
            this.state.takeCount !== takeCount ||
            this.state.height !== height;

        if (hasPendingChanges) {

            const items = await toArray(take(skip(buffer, skipCount), takeCount));

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

        const window = this.base.ownerDocument.defaultView;

        this.base.addEventListener('scroll', this.handleScroll, { passive: true });
        window.addEventListener('resize', this.handleResize, { passive: true });

        const height = this.base.offsetHeight;
        const buffer = new Buffer(this.props.source);

        this.setState({ buffer, height });

    }

    componentWillReceiveProps({ source }) {

        if (source === this.props.source) return;

        const buffer = new Buffer(source);

        this.setState({ buffer });

    }

    shouldComponentUpdate({ position, itemHeight, itemGutter, itemTemplate }, { buffer, items, height }) {

        const hasRenderableChanges =
            this.props.itemTemplate !== itemTemplate ||
            this.state.items !== items;

        const hasUpdatableChanges =
            this.props.position !== position ||
            this.state.height !== height ||
            this.buffer !== buffer;

        if (hasUpdatableChanges) {

            this.updateVisibleRange({ buffer, position, height, itemHeight, itemGutter }).then(() => {

                this.forceUpdate(() => {
                    this.base.scrollTop = this.props.position;
                });

            });

        }

        return hasRenderableChanges;
    }

    componentWillUnmount() {

        const window = this.base.ownerDocument.defaultView;

        this.base.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);

    }

    // devnote, we bring our known props into scope so they are excluded
    // for 'props', which we then bind to our top level container
    // eslint-disable-next-line no-unused-vars
    render({ source, position, total, itemTemplate, itemHeight, itemGutter, ...props }, { buffer, items, skipCount, takeCount }) {

        const offset = getHeightForCount(itemHeight, itemGutter, skipCount);
        const maximumHeight =  getHeightForCount(itemHeight, itemGutter, buffer ? Math.min(buffer.pending.length, total) : 0);

        return (
            <div style={`${STYLE_INNER}`} {...props}>
                <div style={`${STYLE_CONTENT};height: ${maximumHeight + itemGutter}px`}>
                    <div style={`height: ${offset}px`} />
                    {items.map((item, i) => (
                        <div key={skipCount + i} style={`height: ${itemHeight}px;margin-top: ${itemGutter}px`}>
                            {itemTemplate(item)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}
