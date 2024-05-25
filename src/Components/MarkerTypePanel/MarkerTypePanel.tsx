import * as React from 'react';
import classNames from 'classnames';
import './MarkerTypePanel.scss';
import {
    typesThatHaveSubTypes,
    typeLabelMap,
    typeColorMap,
    subTypeSkillBookLabelMap,
} from 'types';
import type {
    MarkerInterface,
    MarkerType,
    MarkerSubtype,
} from 'types';
import MarkerListItem from 'Components/MarkerListItem/MarkerListItem';
import type { MarkerListItemProps } from 'Components/MarkerListItem/MarkerListItem';
import {
    Box,
    Button,
    List,
    ListItem,
    Tooltip,
    Collapse,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export interface MarkerTypePanelProps {
    className?: string;
    type?: MarkerType;
    markers: Array<MarkerInterface>;
    onMarkButtonClick?: (marker: MarkerInterface) => MarkerListItemProps['onMarkCheckboxChange'];
    onTypeClick?: React.DOMAttributes<Element>['onClick'];
    onMarkerTitleClick?: (marker: MarkerInterface) => MarkerListItemProps['onMarkerTitleClick'];
}

const MarkerTypePanel = ({
    className = '',
    type = undefined,
    markers = [],
    onMarkButtonClick = undefined,
    onTypeClick = undefined,
    onMarkerTitleClick = undefined,
}: MarkerTypePanelProps): JSX.Element => {
    const [collapsed, setCollapsed] = React.useState<{ [key: string]: boolean }>({});

    const toggleCollapse = (subTypeId: MarkerSubtype): void => {
        setCollapsed((prev) => ({ ...prev, [subTypeId]: !prev[subTypeId] }));
    };

    const hasSubTypes = type ? typesThatHaveSubTypes.includes(type) : false;

    const subTypes: {
        [index: string]: {
            id: MarkerSubtype;
            markers: Array<MarkerInterface>;
        };
    } = {};

    if (hasSubTypes) {
        markers.forEach((marker) => {
            if (!marker.subType) {
                return;
            }
            const subType = subTypes[marker.subType];

            if (subType) {
                // Already an object, just add the new marker to markers.
                subType.markers.push(marker);
            } else {
                // Create object for sub type
                subTypes[marker.subType] = {
                    id: marker.subType,
                    markers: [marker],
                };
            }
        });
    }

    const renderMarkerListItem = (marker: MarkerInterface): JSX.Element => {
        return (
            <MarkerListItem
                tag={ListItem}
                key={marker.id}
                isFound={marker.isFound}
                onMarkCheckboxChange={onMarkButtonClick ? onMarkButtonClick(marker) : undefined}
                onMarkerTitleClick={onMarkerTitleClick ? onMarkerTitleClick(marker) : undefined}
                title={marker.title}
            />
        );
    };

    return (
        <section className={classNames(['marker-type-panel', className])}>
            <header className={classNames('marker-type-panel__header')}>
                <Box
                    // color will be inherited from FontAwesomeIcon
                    color={type ? typeColorMap[type] : undefined}
                    className={classNames(['marker-type-panel__icon'])}
                >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                </Box>

                <Tooltip label="Only show this marker type" placement="top" hasArrow={true} openDelay={500}>
                    <Button
                        variant="link"
                        colorScheme="blue"
                        className={classNames('marker-type-panel__header-btn')}
                        onClick={onTypeClick}
                    >
                        {type ? typeLabelMap[type] : 'Misc'}
                    </Button>
                </Tooltip>
            </header>

            <List className={classNames('marker-type-panel__list')}>
                {hasSubTypes
                    ? Object.values(subTypes).map((subType) => (
                        <ListItem className={classNames('marker-type-panel__sub-type-list-item')} key={subType.id}>
                            <span
                                className={classNames('marker-type-panel__sub-type-label')}
                                onClick={(): void => toggleCollapse(subType.id)} // Explicit return type added
                                style={{ cursor: 'pointer' }}
                            >
                                {subTypeSkillBookLabelMap[subType.id]}
                            </span>
                            <Collapse in={!collapsed[subType.id]}>
                                <List>
                                    {subType.markers.map((marker) => renderMarkerListItem(marker))}
                                </List>
                            </Collapse>
                        </ListItem>
                    ))
                    : markers.map((marker) => renderMarkerListItem(marker))}
            </List>
        </section>
    );
};

export default MarkerTypePanel;
