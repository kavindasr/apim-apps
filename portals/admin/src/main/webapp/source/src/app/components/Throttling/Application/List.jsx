/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import HelpBase from 'AppComponents/AdminPages/Addons/HelpBase';
import ListBase from 'AppComponents/AdminPages/Addons/ListBase';
import DescriptionIcon from '@mui/icons-material/Description';
import Link from '@mui/material/Link';
import Configurations from 'Config';
import AddEdit from 'AppComponents/Throttling/Application/AddEdit';
import Delete from 'AppComponents/Throttling/Application/Delete';
import API from 'AppData/api';
import EditIcon from '@mui/icons-material/Edit';

/**
 * Render a list
 * @returns {JSX} Header AppBar components.
 */
export default function ListApplicationThrottlingPolicies() {
    const intl = useIntl();
    const restApi = new API();

    const addButtonProps = {
        triggerButtonText: intl.formatMessage({
            id: 'Throttling.Application.Policy.List.addButtonProps.triggerButtonText',
            defaultMessage: 'Add Policy',
        }),
        /* This title is what as the title of the popup dialog box */
        title: intl.formatMessage({
            id: 'Throttling.Application.Policy.List.addButtonProps.title',
            defaultMessage: 'Add Policy',
        }),
    };
    const searchProps = {
        searchPlaceholder: intl.formatMessage({
            id: 'Throttling.Application.Policy..List.search.default',
            defaultMessage: 'Search by Application Policy name',
        }),
        active: true,
    };
    const pageProps = {
        help: (
            <HelpBase>
                <List component='nav' aria-label='main mailbox folders'>
                    <ListItem button>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <Link
                            target='_blank'
                            href={Configurations.app.docUrl
                                + 'design/rate-limiting/adding-new-throttling-policies/'
                                + '#adding-a-new-application-level-throttling-tier'}
                            underline='hover'
                        >
                            <ListItemText primary={(
                                <FormattedMessage
                                    id='Throttling.Application.Policy.List.help.link.one'
                                    defaultMessage='Create an Application Rate Limiting Policy'
                                />
                            )}
                            />

                        </Link>
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DescriptionIcon />
                        </ListItemIcon>
                        <Link
                            target='_blank'
                            href={Configurations.app.docUrl
                                + 'design/rate-limiting/setting-throttling-limits/'
                                + '#application-level-throttling-application-developer'}
                            underline='hover'
                        >
                            <ListItemText primary={(
                                <FormattedMessage
                                    id='Throttling.Application.Policy.List.help.link.two'
                                    defaultMessage='Setting an Application Rate Limiting Policy'
                                />
                            )}
                            />

                        </Link>
                    </ListItem>
                </List>
            </HelpBase>),
        pageStyle: 'half',
        title: intl.formatMessage({
            id: 'Throttling.Application.Policy.search.default',
            defaultMessage: 'Application Rate Limiting Policies',
        }),
        EditTitle: intl.formatMessage({
            id: 'Throttling.Application.Policy.search.default',
            defaultMessage: 'Application Rate Limiting Policies',
        }),
    };

    const columProps = [
        {
            name: 'name',
            label: intl.formatMessage({
                id: 'Admin.Throttling.Application.Throttling.policy.table.header.name',
                defaultMessage: 'Name',
            }),
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: 'quota',
            label: intl.formatMessage({
                id: 'Admin.Throttling.Application.Throttling.policy.table.header.quota',
                defaultMessage: 'Quota',
            }),
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: 'unitTime',
            label: intl.formatMessage({
                id: 'Admin.Throttling.Application.Throttling.policy.table.header.unit.time',
                defaultMessage: 'Unit Time',
            }),
            options: {
                filter: true,
                sort: false,
            },
        },
    ];

    const emptyBoxProps = {
        content: (
            <Typography variant='body2' color='textSecondary' component='p'>
                <FormattedMessage
                    id='Throttling.Application.Policy.List.empty.content.application.policies'
                    defaultMessage={'Application-level throttling policies are applicable per access '
                    + 'token generated for an application.'}
                />
            </Typography>),
        title: (
            <Typography gutterBottom variant='h5' component='h2'>
                <FormattedMessage
                    id='Throttling.Application.Policy.List.empty.title.application.policies'
                    defaultMessage='Application Policies'
                />

            </Typography>),
    };

    /**
 * Mock API call
 * @returns {Promise}.
 */
    function apiCall() {
        let applicationThrottlingvalues;
        return restApi.applicationThrottlingPoliciesGet().then((result) => {
            const applicationPolicies = result.body.list.map((obj) => {
                if (obj.defaultLimit.requestCount !== null) {
                    return {
                        policyName: obj.policyName,
                        quota: obj.defaultLimit.requestCount.requestCount,
                        unitTime: obj.defaultLimit.requestCount.unitTime + ' '
                            + obj.defaultLimit.requestCount.timeUnit,
                        quotaPolicy: obj.defaultLimit.requestCount.type,
                        policyId: obj.policyId,
                    };
                } else {
                    return {
                        policyName: obj.policyName,
                        quota: obj.defaultLimit.bandwidth.dataAmount + ' ' + obj.defaultLimit.bandwidth.dataUnit,
                        unitTime: obj.defaultLimit.bandwidth.unitTime + ' ' + obj.defaultLimit.bandwidth.timeUnit,
                        quotaPolicy: obj.defaultLimit.bandwidth.type,
                        policyId: obj.policyId,
                    };
                }
            });
            applicationThrottlingvalues = applicationPolicies
                .filter((policy) => policy.policyName !== 'Unlimited')
                .map((obj) => {
                    return Object.values(obj);
                });
            return (applicationThrottlingvalues);
        }).catch((error) => {
            const { response } = error;
            if (response.body) {
                throw (response.body.description);
            }
            return null;
        });
    }

    return (
        <ListBase
            columProps={columProps}
            pageProps={pageProps}
            addButtonProps={addButtonProps}
            searchProps={searchProps}
            emptyBoxProps={emptyBoxProps}
            apiCall={apiCall}
            editComponentProps={{
                icon: <EditIcon aria-label='edit-application-policies' />,
                title: 'Edit Application Policy',
            }}
            DeleteComponent={Delete}
            EditComponent={AddEdit}
        />
    );
}
