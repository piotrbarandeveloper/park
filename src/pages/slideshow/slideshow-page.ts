import { Component, ViewChild} from '@angular/core';
import { FabContainer , LoadingController, Slides } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";

import { RestService as DataService} from '../../data/service/rest-service'; 
import { Chapter, Topic, FilterItem, Analysis, Chart } from '../../data/index';

@Component({
    selector: 'samar-slideshow-page',
    templateUrl: 'slideshow-page.html'
})
export class SlideshowPage  {

    public spinnerVisible: boolean;

    private _chapters: ChapterWrapper[];

    private _selectedChapter: ChapterWrapper;

    private _selectedTopic: TopicWrapper;

    private _filterAnalysis: FilterItem;

    @ViewChild(Slides)
    slides: Slides;

    constructor(private dataService: DataService, private loadingController: LoadingController) {
        this.spinnerVisible = true;
    }

    public ionViewDidLoad() {
        this.filterAnalysis = this.dataService.filtersCache[0];

        let loader = this.loadingController.create({ content: "Ładowanie analizy '" + this.filterAnalysis.selection.name + "'..." });
        loader.present();

        this.dataService.analysis(this.dataService.filtersCache).subscribe(analysis => {
            console.log("analysis:", analysis);
            this.dataLoaded(analysis);

            loader.dismiss();
            this.spinnerVisible = false;
        });
    }


    private dataLoaded(analysis: Analysis) {
        let defaultTopicId = analysis.defaultTopicId;
        let tmp = defaultTopicId.split("\.");
        console.log("tmp:", tmp);
        let selectedChapterId = tmp[0] + "." + tmp[1];
        console.log("selectedChapterId:", selectedChapterId);

        this.chapters = [];
        for (let item of analysis.chapters) {
            let topicsWrapper: TopicWrapper[] = [];
            for (let topic of item.topics) {
                let topicWrapper = new TopicWrapper(topic);
                topicsWrapper.push(topicWrapper);
                if (topic.id == defaultTopicId) {
                     this.selectedTopic = topicWrapper;
                }
            }
            console.log("item.id:", item.id, item.id == selectedChapterId);
            let chapterWrapper = new ChapterWrapper(item, topicsWrapper, );
            this.chapters.push(chapterWrapper);

            if (item.id == selectedChapterId) {
                 this.selectedChapter = chapterWrapper;
            }
        }
    }

    @ViewChild(FabContainer)
    private fabContainer: FabContainer;

    /**
     * Obsługa ziany zakładki
     */
    public changeChapter(chapter: ChapterWrapper) {
        console.log("#changeChapter");
        let stateFab = this.fabContainer._listsActive;
        if (stateFab) this.fabContainer.close();

        this.selectedTopic = null;
        this.filterAnalysis.selection.chapterId = chapter.id;

        if (chapter.topics.length == 0 || !chapter.topics[0].content) {
            let loader = this.loadingController.create({ content: "Pobieranie zawartości dla slajdu z zakładki '" + chapter.title + "'." });
            loader.present();

            this.getTopicFromDatabaseAndMergeChapter(chapter).subscribe(topicWrapper => {

                console.log("changeChapter; result after methpd geTopic...():", topicWrapper);
                this.updateTopic(topicWrapper);
    
                //wyłączamy loader
                loader.dismiss();
    
                setTimeout(() => {
                    //otwieramy fab jeżeli przed zmianą zakładki był otwarty
                    if (stateFab) this.fabContainer.toggleList();
                }, 500);
            });
        } else {
            this.updateChapter(chapter);
            this.updateTopic(chapter.topics[0]);

            setTimeout(() => {
                //otwieramy fab jeżeli przed zmianą zakładki był otwarty
                if (stateFab) this.fabContainer.toggleList();
            }, 500);
        }

    }

    /**
     * Obsługa zmiany slajdu
     */
    public changeTopic(chapter: ChapterWrapper, topic: TopicWrapper) {
        let stateFab = this.fabContainer._listsActive;
        if (stateFab) this.fabContainer.close();

        this.selectedTopic = null;
        console.log("# changeTopic");
        console.log("topic:", topic);
        this.filterAnalysis.selection.topicId = topic.id;
        console.log("topic.content:", topic.content.length == 0);

        if (topic.content.length == 0) {
            let loader = this.loadingController.create({ content: "Pobieranie zawartości dla slajdu '" + topic.title + "'." });
            loader.present();
            this.getTopicFromDatabaseAndMergeChapter(chapter, topic).subscribe(result => {
                this.updateTopic(result);

                //wyłączamy loader
                loader.dismiss();

                setTimeout(() => {
                    //otwieramy fab jeżeli przed zmianą zakładki był otwarty
                    if (stateFab) this.fabContainer.toggleList();
                }, 500);
            });
        } else {
            this.updateTopic(topic);

            setTimeout(() => {
                //otwieramy fab jeżeli przed zmianą zakładki był otwarty
                if (stateFab) this.fabContainer.toggleList();
            }, 500);
        }
    }

    /**
     * Aktualizujemy dla slideshowa wybrany topic. Dodatkowo aktualizujemy filtr analizy o wybrany topic.
     * @param topic 
     */
    private updateTopic(topic: TopicWrapper) {
        console.log("# updateTopic method ; topic:", topic);
        this.selectedTopic = topic;
        this.filterAnalysis.selection.topicId = topic.id;
        console.log("this.filterAnalysis:", this.filterAnalysis);
        console.log("this.dataService.filtersCache:", this.dataService.filtersCache);
        console.log("this.chapters:", this.chapters);
    }

    private updateChapter(chapter: ChapterWrapper) {
        console.log("# updateChapter method ; chapter:", chapter);
        let chapterIndex = this.chapters.findIndex(item => item.id == chapter.id);

        this.selectedChapter = chapter;
        this.chapters[chapterIndex] = chapter;
        this.filterAnalysis.selection.chapterId = chapter.id;
    }

    /**
     * Event wywoływany przy zmianie slajdu
     */
    slideChanged() {
        console.log("## slideChanged ##");
        console.log("this.chapters:", this.chapters);
        console.log("this.selectedChapter:", this.selectedChapter);
        let currentIndex = this.slides.getActiveIndex();
        this.changeTopic(this.selectedChapter, this.selectedChapter.topics[currentIndex]);
    }

    goToSlide(index: number) {
        this.slides.slideTo(index);
    }

    /**
     * Pobieramy z bazy wybrany przez użytkownika topic i scalamy całą zakładkę z resztą danych.
     */
    private getTopicFromDatabaseAndMergeChapter(selectedChapter: ChapterWrapper, selectedTopic?:TopicWrapper) {
        return Observable.create((observer: Observer<TopicWrapper>) => {

            //jeżeli zakładka jest pusta i nie zostały pobrane żadne slajdy do wnętrza zakładki
            if (selectedChapter.topics.length == 0) {
                this.dataService.analysis(this.dataService.filtersCache).subscribe(analysis => {
                    if (analysis) {
                        for (let chapter of analysis.chapters) {

                            //szukamy w danych otrzymanych z serwera zakładki, którą chcieliśmy pobrać
                            if (selectedChapter.id == chapter.id) {
                                let topicsWrapper: TopicWrapper[] = [];
                                for (let topic of chapter.topics) {
                                    let topicWrapper = new TopicWrapper(topic);
                                    topicsWrapper.push(topicWrapper);
                                }

                                //scalamy nowe topici z zakładką
                                selectedChapter.topics = topicsWrapper;

                                console.log("pobralismy pierwszy topic dla pustej zakladki:", topicsWrapper[0]);
                                //przekazujemy pierwszy topic                                
                                this.updateChapter(selectedChapter);
                                observer.next(topicsWrapper[0]);
                                break;
                            }
                        }
                    }
                });
            } else if (selectedTopic.content.length == 0) {
                this.dataService.analysis(this.dataService.filtersCache).subscribe(analysis => {

                    if (analysis) {

                        for (let chapter of analysis.chapters) {

                            //szukamy w danych otrzymanych z serwera zakładki, z której chcieliśmy pobrać topic
                            if (selectedChapter.id == chapter.id) {
                                let topicWrapper: TopicWrapper;
                                let topicIndex: number;
                                for (topicIndex = 0; topicIndex < chapter.topics.length; topicIndex++) {
                                    if (chapter.topics[topicIndex].id == selectedTopic.id) {
                                        topicWrapper = new TopicWrapper(chapter.topics[topicIndex]);
                                        break;
                                    }
                                }

                                //scalamy nowy topic z zakładką
                                selectedChapter.topics[topicIndex] = topicWrapper;

                                this.updateChapter(selectedChapter);

                                //przekazujemy topic
                                observer.next(topicWrapper);
                                break;
                            }
                        }

                    }
                });
            } /*else if (!selectedTopic) {
                this.updateChapter(selectedChapter);
                observer.next(selectedChapter.topics[0]);
            }*/
        });
    }

    public get filterAnalysis(): FilterItem {
        return this._filterAnalysis;
    }

    public set filterAnalysis(filter: FilterItem) {
        this._filterAnalysis = filter;
    }

    public get selectedTopic(): TopicWrapper {
        return this._selectedTopic;
    }

    public set selectedTopic(topic: TopicWrapper) {
        this._selectedTopic = topic;
    }

    public get selectedChapter(): ChapterWrapper {
        return this._selectedChapter;
    }

    public set selectedChapter(chapter: ChapterWrapper) {
        this._selectedChapter = chapter;
    }

    public get chapters(): ChapterWrapper[] {
        return this._chapters;
    }

    public set chapters(chapters: ChapterWrapper[]) {
        this._chapters = chapters;
    }
}

export class ChapterWrapper {

    constructor(public chapter: Chapter, public topics: TopicWrapper[]) {

    }

    get id(): string {
        return this.chapter.id;
    }

    get title(): string {
        return this.chapter.title;
    }

}

export class TopicWrapper {

    constructor(private topic: Topic) {

    }

    get id(): string {
        return this.topic.id;
    }

    get title(): string {
        return this.topic.title;
    }

    get iconName(): string {
        return this.topic.iconName;
    }

    get content(): Chart[] {
        return this.topic.charts;
    }
}