import * as React from 'react';

import {Pre, ResizeSensor} from "@blueprintjs/core";
import {inject, observer} from "mobx-react";
import {AppStore, AppStoreLogMessage} from "@/renderer/app/stores/app-store";
import {LogLevel} from "@/renderer/app/services/ui/logging-service";

/**
 <TextArea fill={true} draggable={"false"} growVertically={false}
 value={this.props.appStore!.logMessages ? this.props.appStore!.logMessages : 'The logInfo is empty.'}
 onChange={(e) => e.currentTarget.scrollTop = e.currentTarget.scrollHeight}
 inputRef={(e) => this.element = e}
 >
 </TextArea>
 */
@inject('appStore')
@observer
export class LogPage extends React.PureComponent<{ appStore?: AppStore }> {
    private element = React.createRef<HTMLDivElement>();

    componentDidMount(): void {
        this.scrollLogToBottom();
    }

    componentDidUpdate(): void {
        this.scrollLogToBottom();
    }

    getLogMessageCssClass(level: LogLevel) {
        return 'log-message ' + (level === LogLevel.ERROR ? 'error' : (level === LogLevel.DEBUG ? 'debug' : ''));
    }

    render() {
        return (
            <div className='LogPage custom-scrollbar' ref={this.element}>
                <ResizeSensor onResize={() => this.scrollLogToBottom()}>
                    <Pre>

                        {this.props.appStore!.logMessages.map((e: AppStoreLogMessage, index: number) => {
                            return (
                                <span key={index} className={this.getLogMessageCssClass(e.level)}>
                                        <span className='timestamp'>{e.timestamp.toLocaleTimeString()}</span>
                                        <span className='message'>{e.message}</span>
                                </span>
                            );
                        })}
                        {
                            this.props.appStore!.logMessages.length === 0 ? <span className='log-message debug'>The log is empty.</span> : ''
                        }
                    </Pre>
                </ResizeSensor>
            </div>
        );
    }

    private scrollLogToBottom() {
        if (this.element && this.element.current) {
            this.element.current.scrollTop = this.element.current.scrollHeight
        }
    }
}
