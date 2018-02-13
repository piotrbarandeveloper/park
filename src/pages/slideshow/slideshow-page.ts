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

    public chapters: ChapterWrapper[];

    public selectedChapter: ChapterWrapper;

    public selectedTopic: TopicWrapper;

    public filterAnalysis: FilterItem;

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
        let stateFab = this.fabContainer._listsActive;
        if (stateFab) this.fabContainer.close();

        this.filterAnalysis.selection.chapterId = chapter.id;

        let loader = this.loadingController.create({ content: "Pobieranie zawartości dla slajdu z zakładki '" + chapter.title + "'." });
        loader.present();

        this.getTopicFromDatabaseAndMergeChapter(chapter).subscribe(topicWrapper => {

            this.updateTopic(topicWrapper);

            //wyłączamy loader
            loader.dismiss();

            setTimeout(() => {
                //otwieramy fab jeżeli przed zmianą zakładki był otwarty
                if (stateFab) this.fabContainer.toggleList();
            }, 500);
        });

    }

    /**
     * Obsługa zmiany slajdu
     */
    public changeTopic(topic: TopicWrapper) {
        let stateFab = this.fabContainer._listsActive;
        if (stateFab) this.fabContainer.close();

        this.updateTopic(topic);

        setTimeout(() => {
            //otwieramy fab jeżeli przed zmianą zakładki był otwarty
            if (stateFab) this.fabContainer.toggleList();
        }, 500);
    }

    /**
     * Aktualizujemy dla slideshowa wybrany topic. Dodatkowo aktualizujemy filtr analizy o wybrany topic.
     * @param topic 
     */
    private updateTopic(topic: TopicWrapper) {
        this.selectedTopic = topic;
        this.filterAnalysis.selection.topicId = topic.id;
        console.log("this.filterAnalysis:", this.filterAnalysis);
        console.log("this.dataService.filtersCache:", this.dataService.filtersCache);
    }

    /**
     * Event wywoływany przy zmianie slajdu
     */
    slideChanged() {
        console.log("## slideChanged ##");
        console.log("this.chapters:", this.chapters);
        console.log("this.selectedChapter:", this.selectedChapter);
        let currentIndex = this.slides.getActiveIndex();
        this.changeTopic(this.selectedChapter.topics[currentIndex]);
    }

    goToSlide(index: number) {
        this.slides.slideTo(index);
    }

    /**
     * Pobieramy z bazy wybrany przez użytkownika topic i scalamy całą zakładkę z resztą danych.
     */
    private getTopicFromDatabaseAndMergeChapter(chapter: ChapterWrapper) {
        return Observable.create((observer: Observer<TopicWrapper>) => {
                
            //jeżeli zakładka jest pusta i nie zostały pobrane żadne slajdy do wnętrza zakładki
            if (chapter.topics.length == 0) {
                this.dataService.analysis(this.dataService.filtersCache).subscribe(analysis => {
                    if (analysis) {
                        for (let chapterIter of analysis.chapters) {

                            //szukamy w danych otrzymanych z serwera zakładki, którą chcieliśmy pobrać
                            if (chapter.id == chapterIter.id) {
                                let topicsWrapper: TopicWrapper[] = [];
                                for (let topic of chapterIter.topics) {
                                    let topicWrapper = new TopicWrapper(topic);
                                    topicsWrapper.push(topicWrapper);
                                }

                                //scalamy nowe topici z zakładką
                                chapter.topics = topicsWrapper;

                                //przekazujemy pierwszy topic
                                observer.next(topicsWrapper[0]);
                                break;
                            }
                        }

                        this.selectedChapter = chapter;
                    }
                    observer.complete();
                });
            } else {
                observer.next(chapter.topics[0]);
                this.selectedChapter = chapter;
                observer.complete();
            }
        });
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

    constructor(public topic: Topic) {

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