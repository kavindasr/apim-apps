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
import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import cloneDeep from 'lodash.clonedeep';

import Alert from 'AppComponents/Shared/Alert';
import PermissionTree from './PermissionTree';

/**
 *
 *
 * @export
 * @returns
 */
export default function PermissionsSelector(props) {
    const {
        appMappings, role, onSave,
    } = props;
    const [open, setOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [localAppMappings, setLocalAppMappings] = useState({ ...appMappings });
    const intl = useIntl();
    useEffect(() => {
        setLocalAppMappings(cloneDeep(appMappings));
    }, [appMappings]);

    const permissionCheckHandler = (event) => {
        const {
            name: scopeName, checked, role: selectedRole, app,
        } = event.target;
        const newAppMappings = { ...localAppMappings };
        newAppMappings[app] = newAppMappings[app].map(({ name, roles, ...rest }) => {
            if (name === scopeName) {
                if (checked) {
                    return { ...rest, name, roles: [...roles, selectedRole] };
                } else {
                    return { ...rest, name, roles: roles.filter((thisRole) => selectedRole !== thisRole) };
                }
            } else {
                return { name, roles, ...rest };
            }
        });
        setLocalAppMappings(newAppMappings);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        // TODO: Need to reset the mapping to last saved state ~tmkb
        setOpen(false);
        setLocalAppMappings(appMappings);
    };
    const handleSave = () => {
        setIsSaving(true);
        onSave(localAppMappings)
            .then(() => {
                Alert.info(
                    <span>
                        {intl.formatMessage(
                            {
                                id: 'RolePermissions.TreeView.PermissionsSelector.update.scope.success',
                                defaultMessage: 'Update permissions for {role} successfully',
                            },
                            {
                                role: <b>{role}</b>,
                            },
                        )}
                    </span>,
                );
                setOpen(false);
            })
            .catch((error) => {
                Alert.error(
                    intl.formatMessage({
                        id: 'RolePermissions.TreeView.PermissionsSelector.update.scope.error',
                        defaultMessage: 'Something went wrong while updating the permission',
                    }),
                );
                console.error(error);
            })
            .finally(() => setIsSaving(false));
    };
    return (
        <>
            <Button
                onClick={handleClickOpen}
                size='small'
                variant='outlined'
                color='primary'
                data-testid={role + '-scope-assignment'}
            >
                <FormattedMessage
                    id='RolePermissions.TreeView.PermissionsSelector.scope.assignment.button'
                    defaultMessage='Scope Assignments'
                />
            </Button>
            <Dialog
                fullWidth
                maxWidth='md'
                open={open}
                onClose={(event, reason) => {
                    if (reason !== 'backdropClick' || !isSaving) {
                        handleClose(event, reason);
                    }
                }}
                aria-labelledby='select-permissions-for-role'
            >
                <DialogTitle id='select-permissions-for-role'>
                    <Typography variant='h5' display='block' gutterBottom>
                        {role}
                        <Box display='inline' pl={1}>
                            <Typography variant='caption' gutterBottom>
                                <FormattedMessage
                                    id='RolePermissions.TreeView.PermissionsSelector.scope.assignment.title'
                                    defaultMessage='Select Scope Assignments'
                                />
                            </Typography>
                        </Box>
                    </Typography>
                </DialogTitle>
                <DialogContent style={{ height: '90vh' }}>
                    <Box pl={5}>
                        <PermissionTree onCheck={permissionCheckHandler} role={role} appMappings={localAppMappings} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        size='small'
                        variant='outlined'
                        onClick={handleClose}
                    >
                        <FormattedMessage
                            id='RolePermissions.TreeView.PermissionsSelector.scope.assignment.cancel.btn'
                            defaultMessage='Cancel'
                        />
                    </Button>
                    <Button
                        size='small'
                        variant='contained'
                        color='primary'
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving && <CircularProgress size={16} />}
                        <FormattedMessage
                            id='RolePermissions.TreeView.PermissionsSelector.scope.assignment.save.btn'
                            defaultMessage='Save'
                        />
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
