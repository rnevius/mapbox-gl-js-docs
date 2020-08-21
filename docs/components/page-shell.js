// This file is ready-to-go with likely few (or no) required changes.
// It's required to initialize the ReactPageShell and load the PageShell.
import React from 'react';
import PropTypes from 'prop-types';
// docs-page-shell
import ReactPageShell from '../../vendor/docs-page-shell/react-page-shell.js';
// dr-ui components
import AnalyticsShell from '@mapbox/dr-ui/analytics-shell';
import PageLayout from '@mapbox/dr-ui/page-layout';
import { buildMeta, findParentPath } from '@mapbox/dr-ui/page-layout/utils';
// site variables
import constants from '../constants';
// batfish modules
import { withLocation } from '@mapbox/batfish/modules/with-location';
// dataSelectors
import navigation from '@mapbox/batfish/data/navigation'; // eslint-disable-line
import topics from '@mapbox/batfish/data/topics'; // eslint-disable-line
import mbxMeta from '@mapbox/batfish/data/mbx-meta'; // eslint-disable-line

import ApiSidebar from './api/sidebar.js';
import StyleSpecSidebar from './style-spec/sidebar.js';
import AppropriateImage from './appropriate-image';
import redirectApiRef from '../util/api-ref-redirect';
import classnames from 'classnames';

const redirectStyleSpec = require('../util/style-spec-redirect');

class PageShell extends React.Component {
    componentDidMount() {
        // redirect hashes on /style-spec/
        if (
            this.props.location.pathname === '/mapbox-gl-js/style-spec/' &&
            this.props.location.hash
        ) {
            if (redirectStyleSpec(this.props.location))
                window.location = redirectStyleSpec(this.props.location);
        }

        // redirect hashes on /api/
        if (
            this.props.location.pathname === '/mapbox-gl-js/api/' &&
            this.props.location.hash
        ) {
            if (redirectApiRef(this.props.location))
                window.location = redirectApiRef(this.props.location);
        }
    }
    renderCustomSideBar = () => {
        const { location, frontMatter, headings } = this.props;
        const subSection = findParentPath(
            navigation,
            this.props.location.pathname
        );
        if (subSection === '/mapbox-gl-js/api/')
            return (
                <ApiSidebar
                    frontMatter={frontMatter}
                    location={location}
                    headings={frontMatter.headings || headings}
                />
            );
        else if (subSection === '/mapbox-gl-js/style-spec/')
            return (
                <StyleSpecSidebar
                    frontMatter={frontMatter}
                    location={location}
                />
            );
        else return undefined;
    };
    render() {
        const { location, children, frontMatter } = this.props;
        const meta = buildMeta(frontMatter, location.pathname, navigation);

        return (
            <ReactPageShell
                site={constants.SITE}
                subsite={meta.subsite || undefined}
                {...this.props}
                meta={meta}
                darkHeaderText={true}
            >
                <AnalyticsShell mbxMetadata={mbxMeta[this.props.location.pathname]} location={location}>
                    <PageLayout
                        location={location}
                        frontMatter={{
                            ...frontMatter,
                            // set defaults for "example" pages
                            ...(frontMatter.layout === 'example' && {
                                includeFilterBar: true
                            })
                        }}
                        constants={constants}
                        navigation={navigation}
                        topics={topics}
                        AppropriateImage={AppropriateImage}
                        // use custom sidebar for API and Style Spec since this data needs to be generated
                        customSidebar={this.renderCustomSideBar()}
                    >
                    <div className={classnames('', {
                      'style-spec-page': location.pathname.indexOf('/style-spec/') > -1
                    })}>
                        {children}
                        </div>
                    </PageLayout>
                </AnalyticsShell>
            </ReactPageShell>
        );
    }
}

PageShell.propTypes = {
    meta: PropTypes.object,
    frontMatter: PropTypes.object.isRequired,
    children: PropTypes.node,
    location: PropTypes.object.isRequired,
    headings: PropTypes.array
};

export default withLocation(PageShell);
