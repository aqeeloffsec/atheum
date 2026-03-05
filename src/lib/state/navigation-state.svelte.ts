export class NavigationState {
    features = $state<HTMLElement | null>(null);
    howItWorks = $state<HTMLElement | null>(null);
    pricing = $state<HTMLElement | null>(null);
    faq = $state<HTMLElement | null>(null);
}

export const navigationState = new NavigationState();
