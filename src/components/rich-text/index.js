import { h, Component } from 'preact';

const uriPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g;

export function getHtml(text) {
    return text
        .replace(uriPattern, v => `<a href="${v}">${v}</a>`)
        .replace(/\n/g, '<br>');
}

export default class RichText extends Component {

    shouldComponentUpdate({ text }) {
        return this.props.text !== text;
    }

    render({ text, ...props }) {
        return <div {...props} dangerouslySetInnerHTML={{ __html: getHtml(text) }} />;
    }

}
