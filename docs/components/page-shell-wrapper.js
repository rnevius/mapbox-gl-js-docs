// This file is ready-to-go with likely few (or no) required changes.
// It's required to initialize the ReactPageShell and load the PageShell.
import React from 'react';
import PropTypes from 'prop-types';
// docs-page-shell
import ReactPageShell from '../../vendor/docs-page-shell/react-page-shell.js';
// dr-ui components
import AnalyticsShell from '@mapbox/dr-ui/analytics-shell';
import PageLayout from '@mapbox/dr-ui/page-layout';
import { buildMeta } from '@mapbox/dr-ui/page-layout/utils';
// site variables
import constants from '../constants';
// batfish modules
import { withLocation } from '@mapbox/batfish/modules/with-location';
// dataSelectors
import navigation from '@mapbox/batfish/data/navigation'; // eslint-disable-line
import topics from '@mapbox/batfish/data/topics'; // eslint-disable-line

class PageShellWrapper extends React.Component {
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
                <AnalyticsShell location={location}>
                    <PageLayout
                        location={location} // prop
                        frontMatter={frontMatter} // prop
                        constants={constants} // local object
                        navigation={navigation}
                        topics={topics}
                    >
                        {children}
                    </PageLayout>
                </AnalyticsShell>
            </ReactPageShell>
        );
    }
}

PageShellWrapper.propTypes = {
    meta: PropTypes.object,
    frontMatter: PropTypes.object.isRequired,
    children: PropTypes.node,
    location: PropTypes.object.isRequired
};

export default withLocation(PageShellWrapper);
