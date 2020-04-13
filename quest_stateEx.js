load("script/utils.js")
load("script/ScriptData.js")
load("script/questinfo.js")

System = Java.type("java.lang.System")
URI = Java.type("java.net.URI")
StandardCharsets = Java.type("java.nio.charset.StandardCharsets")
Files = Java.type("java.nio.file.Files")
Paths = Java.type("java.nio.file.Paths")
StandardOpenOption = Java.type("java.nio.file.StandardOpenOption")
Optional = Java.type("java.util.Optional")
IOUtils = Java.type("org.apache.commons.io.IOUtils")

function header() {
    return ["進捗詳細"]
}

function begin() {
    if (!getData("update")) {
        updateFile()
        setTmpData("update", true)
    }
}

function body(quest) {
    return toComparable([getProgress(quest.no, quest.type, quest.progressFlag)])
}

function end() {}

function getProgress(questNo, questType, questProgressFlag) {
    if (questType !== QUEST_TYPE.ONCE) {
        if (questNo in QUEST_DATA) {
            var sum = 0
            var result = ""
            var conditions = QUEST_DATA[questNo]
            conditions.forEach(function (condition, i) {
                var count = getQuestCount(questNo, i + 1)
                var max = condition.max
                var rate = Math.min(count, max) / max * 100
                sum += rate
                if (rate < 100) {
                    result += Optional.ofNullable(condition.title).map(function (title) {
                        return " " + title + ":"
                    }).orElse(" ") + Math.min(count, max) + "/" + max
                }
            })
            sum = Math.floor(sum / conditions.length)
            switch (parseInt(questProgressFlag)) {
                case QUEST_PROGRESS_FLAG.HALF:
                    if (sum < 50) sum = 50
                    break
                case QUEST_PROGRESS_FLAG.EIGHTY:
                    if (sum < 80) sum = 80
                    break
            }
            saveQuestRate(questNo, sum / 100)
            return String(sum + "%" + result)
        } else {
            saveQuestRate(questNo, -1)
            return "情報未登録"
        }
    } else {
        saveQuestRate(questNo, -1)
        return null
    }
}

/**
 * ファイルをアップデートします
 */
function updateFile() {
    try {
        var newVersion = Number(JSON.parse(
                IOUtils.toString(URI.create(UPDATE_CHECK_URL), StandardCharsets.UTF_8))
            .tag_name.replace(/v(.*)\.(\d)$/, "$1$2"))
        if (VERSION < newVersion) {
            FILE_URL.forEach(function (url) {
                IOUtils.write(
                    IOUtils.toString(URI.create(url), StandardCharsets.UTF_8),
                    Files.newOutputStream(
                        Paths.get("script/" + url.replace(/^.*\/(.*?\.js)$/, "$1")),
                        StandardOpenOption.CREATE,
                        StandardOpenOption.TRUNCATE_EXISTING),
                    StandardCharsets.UTF_8)
            })
        }
    } catch (e) {
        System.out.println("File Update Failed.")
        e.printStackTrace()
    }
}