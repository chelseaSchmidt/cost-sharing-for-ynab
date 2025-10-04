import { CSSProperties, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import isNumber from 'lodash/isNumber';
import uniqueId from 'lodash/uniqueId';
import styled from 'styled-components';
import colors from '../colors';
import ExpandIcon from './ExpandIcon';

/**
 * STYLING
 */

const HEIGHT_TRANSITION_MS = 200;

const Container = styled.section``;

const Header = styled.h2`
  all: unset;
  display: flex;
  align-items: center;
`;

const HeaderButton = styled.button`
  all: unset;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 5px;
  box-shadow: 0 1px 2px 0 #999;
  padding: 10px;
  margin: 10px 0;
  background: ${colors.primaryLight};
  font-size: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  text-align: left;
  letter-spacing: 0.1px;

  &:hover {
    background: #eee;
  }

  &:active {
    background: #ddd;
  }

  &:focus-visible {
    outline: 1px solid ${colors.primary};
  }
`;

const TitleArea = styled.div`
  width: 100%;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 100%;
`;

const AccentIcon = styled.div`
  font-weight: normal;
  text-shadow: none;
  letter-spacing: normal;
  display: flex;
  align-items: center;
  padding-right: 9px;
`;

const Subtitle = styled.div`
  margin-top: 5px;
  font-size: 0.7em;
`;

const Panel = styled.div`
  overflow: hidden;
`;

const Content = styled.div`
  padding: 10px 15px;

  > * {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

/**
 * COMPONENT
 */

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  contentStyle?: CSSProperties;
  children: ReactNode;
}

interface PanelState {
  height: number | 'auto';
  collapsing: boolean;
}

const Accordion = ({ title, subtitle = '', icon, contentStyle = {}, children }: Props) => {
  const [panelState, setPanelState] = useState<PanelState>({
    height: 0,
    collapsing: false,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const contentId = uniqueId('content');
  const buttonId = uniqueId('button');

  const expanded = panelState.height === 'auto' || panelState.height > 0;

  const transitionDuration =
    contentRef.current && contentRef.current.getBoundingClientRect().height > 300
      ? HEIGHT_TRANSITION_MS * 2
      : HEIGHT_TRANSITION_MS;

  useEffect(
    function onCollapseRequest() {
      if (panelState.collapsing) {
        collapsePanel(setPanelState);
      }
    },
    [panelState.collapsing],
  );

  return (
    <Container>
      {/* https://www.w3.org/WAI/ARIA/apg/patterns/accordion/examples/accordion/ */}
      <Header>
        <HeaderButton
          type="button"
          id={buttonId}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={() => {
            if (expanded) {
              // doooom
              prepareForCollapse(setPanelState, panelRef);
            } else {
              expandPanelToFixedHeight(setPanelState, contentRef);
              flexPanelHeightAfterTransition(setPanelState);
            }
          }}
        >
          <TitleArea>
            <Title>
              {icon && <AccentIcon>{icon}</AccentIcon>}
              {title}
            </Title>

            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </TitleArea>

          <ExpandIcon expanded={expanded} />
        </HeaderButton>
      </Header>

      <Panel
        ref={panelRef}
        id={contentId}
        aria-labelledby={buttonId}
        role="region"
        style={{
          visibility: expanded ? 'visible' : 'hidden',
          height: isNumber(panelState.height) ? `${panelState.height}px` : panelState.height,
          transition:
            `height ${transitionDuration}ms ease-out,` +
            `visibility ${transitionDuration}ms linear`,
        }}
      >
        <Content ref={contentRef} style={contentStyle}>
          {children}
        </Content>
      </Panel>
    </Container>
  );
};

/**
 * HELPER METHODS
 */

/**
 * Collapse - step 1
 * Height transition effect doesn't work with `height: auto`, so first convert to a fixed height
 */
function prepareForCollapse(
  setPanelState: (state: PanelState) => void,
  panelRef: null | RefObject<HTMLDivElement | null>,
) {
  if (panelRef?.current) {
    setPanelState({
      height: panelRef.current.getBoundingClientRect().height,
      collapsing: true,
    });
  }
}

/**
 * Collapse - step 2
 */
function collapsePanel(setPanelState: (state: PanelState) => void) {
  setPanelState({ height: 0, collapsing: false });
}

/**
 * Expand - step 1
 * Height transition effect doesn't work with `height: auto`, so first expand to a fixed height
 */
function expandPanelToFixedHeight(
  setPanelState: (state: PanelState) => void,
  contentRef: null | RefObject<HTMLDivElement | null>,
) {
  if (contentRef?.current) {
    setPanelState({
      height: contentRef.current.getBoundingClientRect().height,
      collapsing: false,
    });
  }
}

/**
 * Expand - step 2
 *
 * After transition effect ends, allow height to adjust for content of changing size, such as nested
 * Accordion components
 *
 * Alternative to a setTimeout would be listening for the 'transitionend' event; however, while a
 * setTimeout creates potential for an aborted transition effect if timing is mismatched, it's
 * better than potentially inaccessible content if the 'transitionend' event doesn't fire or isn't
 * picked up by the listener
 */
function flexPanelHeightAfterTransition(setPanelState: (state: PanelState) => void) {
  setTimeout(() => {
    setPanelState({
      height: 'auto',
      collapsing: false,
    });
  }, HEIGHT_TRANSITION_MS);
}

export default Accordion;
